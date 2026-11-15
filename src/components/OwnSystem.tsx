/* MAP YOUR OWN SYSTEM: the builder. Name the organisation and who it
   serves, pick what kind of organisation it is, name the parts, say what
   each depends on and how, choose the threats that apply, read what the map
   says, and build. The draft survives leaving the page; a built map can be
   edited again from its gauge. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MODUX_MODELS } from '../content/registry';
import { NODE_KIND_LABEL, type NodeKind } from '../content/modux-schema';
import {
  buildOwnGauge, emptySpec, specFromTemplate, templates, problemsOf, candidates, defaultThreatIds, effectiveThreatIds, readMap,
  HOW_LINE, TAG_CHOICES, MAX_PARTS, MIN_THREATS, MAX_THREATS, systemOf, howFor, type OwnSpec, type OwnPart, type OwnHow,
  specFromKnown, knownById, knownGroups, closestKnown, KIND_HINT,
} from '../content/modux/own';
import { moduxById } from '../content/registry';
import { SystemAtlas } from './SystemAtlas';
import { ManyDays } from './ManyDays';
import { useS } from '../lib/state';
import { useEngine } from '../lib/engine';
import { Field } from '../lib/field';
import { peopleOf } from '../lib/people';

const KINDS = Object.keys(NODE_KIND_LABEL) as NodeKind[];
const hours = (x: number) => String(Math.round(x));
/** a short list of kinds in words: four at most, then how many more */
const kindWord = (k: NodeKind) => (k === 'model' ? 'AI model' : NODE_KIND_LABEL[k].toLowerCase());
const kindWords = (ks: NodeKind[]) => {
  const w = ks.slice(0, 4).map(kindWord);
  if (ks.length > 4) return w.join(', ') + ' and ' + (ks.length - 4) + ' more kinds of';
  return w.length > 1 ? w.slice(0, -1).join(', ') + ' and ' + w[w.length - 1] : w.join('');
};

export function OwnSystem({ onClose, initial, editingId }: { onClose: () => void; initial?: OwnSpec; editingId?: string }) {
  const { s, d } = useS();
  const eng = useEngine();
  const byId = useMemo(() => new Map(MODUX_MODELS.map(m => [m.id, m])), []);
  const [spec, setSpec] = useState<OwnSpec>(() => initial || s.ownDraft || emptySpec());
  const [tpl, setTpl] = useState('');
  const [err, setErr] = useState('');
  /* the known systems: real organisations mapped from public sources */
  const groups = useMemo(() => knownGroups(), []);
  const knownCount = groups.reduce((n, g) => n + g.systems.length, 0);
  const [picking, setPicking] = useState(false);
  const [kq, setKq] = useState('');
  const [kg, setKg] = useState('all');
  const shownKnown = useMemo(() => {
    const q = kq.trim().toLowerCase();
    return groups.flatMap(g => g.systems).filter(k => (kg === 'all' || k.group === kg) &&
      (!q || (k.name + ' ' + k.sector + ' ' + k.keystoneQuestion + ' ' + k.coreProblem + ' ' + k.tags.join(' ')).toLowerCase().includes(q)));
  }, [groups, kq, kg]);

  /* the draft survives leaving the page: saved a moment after the last change */
  const saveTimer = useRef(0);
  useEffect(() => {
    if (editingId) return;
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => d({ t: 'own-draft', spec }), 400);
    return () => window.clearTimeout(saveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec]);

  const problems = problemsOf(spec);
  const named = spec.parts.filter(p => p.name.trim());
  const pool = useMemo(() => candidates(spec), [spec]);
  const picked = useMemo(() => new Set(effectiveThreatIds(spec)), [spec]);
  const read = useMemo(() => (problems.length ? null : readMap(spec, byId)), [spec, byId, problems.length]);
  /* the map as drawn, live: the parts and their links, and the threats once the map builds */
  const liveSystem = useMemo(() => systemOf(spec), [spec]);
  const draft = useMemo(() => (problems.length ? null : buildOwnGauge(spec, byId)), [spec, byId, problems.length]);
  /* the two hundred days run on the map once it stops changing, so typing a part's name never waits on them */
  const [settled, setSettled] = useState(draft);
  useEffect(() => { const t = setTimeout(() => setSettled(draft), 600); return () => clearTimeout(t); }, [draft]);
  const known = spec.known ? knownById(spec.known) : undefined;
  const near = useMemo(() => closestKnown(spec), [spec]);
  const modelNames = (ids: string[]) => ids.map(id => moduxById(id)?.name).filter(Boolean).join(', ');

  function patchPart(id: string, patch: Partial<OwnPart>) {
    setSpec(sp => ({ ...sp, parts: sp.parts.map(p => (p.id === id ? { ...p, ...patch } : p)) }));
  }
  function addPart() {
    if (spec.parts.length >= MAX_PARTS) return;
    const n = spec.parts.length + 1;
    setSpec(sp => ({ ...sp, parts: [...sp.parts, { id: 'p' + n + '-' + Date.now().toString(36), name: '', kind: 'network', dependsOn: [], how: 'needs' }] }));
  }
  function removePart(id: string) {
    setSpec(sp => ({ ...sp, parts: sp.parts.filter(p => p.id !== id).map(p => ({ ...p, dependsOn: p.dependsOn.filter(x => x !== id) })) }));
  }
  function toggleDep(id: string, dep: string) {
    setSpec(sp => ({ ...sp, parts: sp.parts.map(p => {
      if (p.id !== id) return p;
      if (p.dependsOn.includes(dep)) return { ...p, dependsOn: p.dependsOn.filter(x => x !== dep) };
      return { ...p, dependsOn: [...p.dependsOn, dep], hows: { ...(p.hows || {}), [dep]: p.kind === 'public' ? 'serves' : p.how } };
    }) }));
  }
  function setHow(id: string, dep: string, how: OwnHow) {
    setSpec(sp => ({ ...sp, parts: sp.parts.map(p => (p.id === id ? { ...p, hows: { ...(p.hows || {}), [dep]: how } } : p)) }));
  }
  function toggleTag(tag: string) {
    setSpec(sp => ({ ...sp, tags: sp.tags.includes(tag) ? sp.tags.filter(t => t !== tag) : [...sp.tags, tag] }));
  }
  function toggleThreat(id: string) {
    const cur = [...picked];
    const next = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
    if (next.length < MIN_THREATS || next.length > MAX_THREATS) return;
    setSpec(sp => ({ ...sp, threatIds: next }));
  }
  function loadTemplate(key: string) {
    setTpl(key);
    if (!key) { setSpec(emptySpec()); return; }
    const next = specFromTemplate(key);
    if (next) setSpec(next);
  }
  function loadKnown(id: string) {
    const next = specFromKnown(id);
    if (!next) return;
    setTpl('');
    setSpec(next);
    setPicking(false);
    eng.knownStarted(id);
  }
  function build(intoWorld: boolean) {
    setErr('');
    const g = buildOwnGauge(spec, byId);
    if (!g) { setErr(problems[0] || 'The map did not build. Add a part of another kind.'); return; }
    d({ t: 'forge-add', gauge: g });
    d({ t: 'own-spec', id: g.id, spec });
    if (editingId && editingId !== g.id && !(s.gauges[editingId]?.runs)) d({ t: 'forge-remove', id: editingId });
    if (!editingId) d({ t: 'own-draft', spec: null });
    eng.ownBuilt();
    Field.pulse(undefined, '#a78bff', 'seal');
    d({ t: 'route', view: 'modux-gauge', id: g.id, sub: intoWorld ? 'world' : undefined });
  }

  const kindsOnMap = KINDS.filter(k => named.some(p => p.kind === k));

  return (
    <div className="own mx-glass" role="region" aria-label="Map your own system">
      <div className="own-head">
        <div>
          <h3 style={{ margin: 0 }}>{editingId ? 'Edit Your System' : 'Map Your Own System'}</h3>
          <p className="sec" style={{ margin: '4px 0 0' }}>Name the parts, what each depends on, and who it serves. Choose the threats that apply. The forge sets a budget the gauge can be held at, and the World draws your system.</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
      </div>

      {!editingId && (
        <div className="own-start">
          <span className="label">Start from</span>
          <div className="own-start-row">
            <button type="button" className={'chip' + (!tpl && !spec.known ? ' on' : '')} aria-pressed={!tpl && !spec.known} onClick={() => loadTemplate('')}>A blank map</button>
            <select value={tpl} onChange={e => loadTemplate(e.target.value)} aria-label="Start from a sample organisation">
              <option value="">A sample organisation</option>
              {templates().map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
            {knownCount > 0 && <button type="button" className={'btn btn-sm' + (picking ? ' btn-key' : '')} onClick={() => setPicking(v => !v)} aria-expanded={picking}>A known system · {knownCount}</button>}
          </div>
        </div>
      )}

      {picking && !editingId && (
        <div className="own-known" role="region" aria-label="Known systems">
          <p className="sec" style={{ margin: 0 }}>Real organisations, mapped from public sources with the same parts and pressures you use here. Start from one, run its stress day, then change it to make it yours.</p>
          <input className="mx-search" value={kq} onChange={e => setKq(e.target.value)} placeholder="Search by name, sector or question" aria-label="Search the known systems" maxLength={80} />
          <div className="chiprow">
            <button type="button" className={'chip' + (kg === 'all' ? ' on' : '')} aria-pressed={kg === 'all'} onClick={() => setKg('all')}>All</button>
            {groups.map(g => <button type="button" key={g.group} className={'chip' + (kg === g.group ? ' on' : '')} aria-pressed={kg === g.group} onClick={() => setKg(g.group)}>{g.group}</button>)}
          </div>
          <ul className="own-known-grid">
            {shownKnown.map(k => (
              <li key={k.id}>
                <button type="button" className={'own-known-card' + (spec.known === k.id ? ' on' : '')} onClick={() => loadKnown(k.id)}>
                  <span className="own-known-top"><strong>{k.name}</strong><span>{k.map.parts.length} parts · {k.map.threats.length} threats</span></span>
                  <span className="own-known-sector">{k.sector}</span>
                  <span className="own-known-q">{k.keystoneQuestion}</span>
                </button>
              </li>
            ))}
          </ul>
          {shownKnown.length === 0 && <p className="sec" style={{ margin: 0 }}>Nothing matches that search.</p>}
        </div>
      )}

      {known && (
        <div className="own-known-read">
          <span className="label">Started from {known.name}</span>
          <p className="own-known-q">{known.keystoneQuestion}</p>
          <dl>
            <div><dt>Its outlier move</dt><dd>{known.outlierMove}</dd></div>
            {known.securityLeverage[0] && (
              <div><dt>Its strongest security move</dt><dd>{known.securityLeverage[0].move}{known.securityLeverage[0].models.length > 0 && <span className="own-known-models"> In the catalog: {modelNames(known.securityLeverage[0].models)}.</span>}</dd></div>
            )}
            <div><dt>The lesson</dt><dd>{known.lesson}</dd></div>
          </dl>
          <p className="sec" style={{ margin: 0 }}>Run it as it is, or change any part to make it your own.</p>
        </div>
      )}

      <div className="own-grid own-grid-2">
        <label>
          <span className="label">The organisation</span>
          <input value={spec.org} onChange={e => setSpec(sp => ({ ...sp, org: e.target.value }))} placeholder="Kessler Run Water Authority" maxLength={60} />
        </label>
        <label>
          <span className="label">Who it serves{read?.people ? ' · reads as ' + read.people : spec.serves.trim() && !peopleOf(spec.serves) ?' · add a number and the record counts them' : ''}</span>
          <input value={spec.serves} onChange={e => setSpec(sp => ({ ...sp, serves: e.target.value }))} placeholder="Drinking water for a town of 30,000" maxLength={120} />
        </label>
      </div>

      <div className="own-tags">
        <span className="label">What kind of organisation</span>
        <div className="chiprow">
          {TAG_CHOICES.map(t => (
            <button type="button" key={t.tag} className={'chip' + (spec.tags.includes(t.tag) ? ' on' : '')} aria-pressed={spec.tags.includes(t.tag)} onClick={() => toggleTag(t.tag)}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="own-parts">
        <span className="label">The parts · {named.length} named</span>
        <ul>
          {spec.parts.map((p, i) => {
            const others = spec.parts.filter(q => q.id !== p.id && q.name.trim());
            return (
              <li key={p.id} className="own-part">
                <div className="own-part-row">
                  <input value={p.name} onChange={e => patchPart(p.id, { name: e.target.value })} placeholder={'Part ' + (i + 1) + ', such as Control room'} maxLength={48} aria-label={'Name of part ' + (i + 1)} />
                  <select value={p.kind} onChange={e => patchPart(p.id, { kind: e.target.value as NodeKind })} aria-label={'Kind of part ' + (i + 1)} title={KIND_HINT[p.kind]}>
                    {KINDS.map(k => <option key={k} value={k}>{NODE_KIND_LABEL[k]}</option>)}
                  </select>
                  {spec.parts.length > 3 && <button type="button" className="goal-x" onClick={() => removePart(p.id)} aria-label={'Remove part ' + (i + 1)}>×</button>}
                </div>
                {others.length > 0 && (
                  <div className="own-deps">
                    <span className="own-deps-l">Depends on</span>
                    <span className="chiprow">
                      {others.map(q => (
                        <button type="button" key={q.id} className={'chip' + (p.dependsOn.includes(q.id) ? ' on' : '')} aria-pressed={p.dependsOn.includes(q.id)} onClick={() => toggleDep(p.id, q.id)}>{q.name}</button>
                      ))}
                    </span>
                    {p.dependsOn.filter(dep => others.some(q => q.id === dep)).map(dep => (
                      <span className="own-dep-row" key={dep}>
                        <span className="own-dep-name">{others.find(q => q.id === dep)?.name}</span>
                        <select value={howFor(p, dep)} onChange={e => setHow(p.id, dep, e.target.value as OwnHow)} aria-label={'How ' + (p.name || 'part ' + (i + 1)) + ' depends on ' + (others.find(q => q.id === dep)?.name || dep)} title={HOW_LINE[howFor(p, dep)].note}>
                          {(Object.keys(HOW_LINE) as OwnHow[]).map(h => <option key={h} value={h}>{HOW_LINE[h].label}</option>)}
                        </select>
                      </span>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-sm" onClick={addPart} disabled={spec.parts.length >= MAX_PARTS}>Add a part</button>
          <span className="sec" style={{ margin: 0, fontSize: '0.88rem' }}>Up to {MAX_PARTS}. One part is the people: the public the service reaches, or the staff who run it.</span>
        </div>
        <details className="own-kinds">
          <summary>What each kind of part means</summary>
          <dl>
            {KINDS.map(k => <div key={k}><dt>{NODE_KIND_LABEL[k]}</dt><dd>{KIND_HINT[k]}</dd></div>)}
          </dl>
        </details>
      </div>

      {named.length >= 2 && (
        <div className="own-map">
          <span className="label">The map as drawn{draft ? ' · with its hardening plan' : ''}</span>
          <SystemAtlas system={liveSystem} threats={draft?.threats || []} gauge={draft} byId={byId} reading={!!draft} stack={draft?.expert} plan={{ name: spec.org.trim() || 'Your system' }} label="Your system" />
        </div>
      )}

      {named.length >= 3 && pool.length > 0 && (
        <div className="own-threats">
          <div className="row-between" style={{ gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
            <span className="label">The threats · {picked.size} chosen of {pool.length} that fit</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSpec(sp => ({ ...sp, threatIds: defaultThreatIds(sp) }))}>Let the forge choose</button>
          </div>
          <p className="sec" style={{ margin: '0 0 10px', fontSize: '0.9rem' }}>Between {MIN_THREATS} and {MAX_THREATS}. Each one hits a part of its kind. The forge spreads them across the parts before any part is hit twice.</p>
          {kindsOnMap.map(k => {
            const list = pool.filter(p => p.target === k);
            if (!list.length) return null;
            return (
              <div key={k} className="own-threat-kind">
                <span className="own-deps-l">{NODE_KIND_LABEL[k]} · {named.filter(p => p.kind === k).map(p => p.name).join(', ')}</span>
                <ul>
                  {list.map(p => (
                    <li key={p.id}>
                      <label className={'own-threat' + (picked.has(p.id) ? ' on' : '')}>
                        <input type="checkbox" checked={picked.has(p.id)} onChange={() => toggleThreat(p.id)} />
                        <span><strong>{p.name}</strong><em>{'·'.repeat(p.weight)}</em><small>{p.move}</small></span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {read && (
        <div className="own-read">
          <span className="label">What the map says</span>
          <ul>
            {read.hub && <li><strong>{read.hub.name}</strong> is what {read.hub.dependents} parts depend on. A failure there is the day's shape.</li>}
            {read.unreached.length > 0 && <li>Nothing on the map reaches <strong>{read.unreached.join(', ')}</strong> yet. Say what they depend on, or the day cannot touch them.</li>}
            {read.chain.length >= 2 && <li>The people are reached through <strong>{read.chain.slice(0, -1).join(', then ')}</strong>. A failure anywhere on that chain reaches {read.chain[read.chain.length - 1]}{read.chain.length > 3 ? ', with the delays on each pipe in between' : ''}.</li>}
            {read.loose.length > 0 && <li><strong>{read.loose.join(', ')}</strong> {read.loose.length === 1 ? 'is' : 'are'} not joined to anything yet. The model will treat {read.loose.length === 1 ? 'it' : 'them'} as standing alone.</li>}
            {near && <li>Its shape is closest to <strong>{near.system.name}</strong>: both have {kindWords(near.shared)} parts. {near.system.securityLeverage[0] ? <>The move {near.system.name} leans on most is: {near.system.securityLeverage[0].move}</> : null}</li>}
            {read.bare !== null && <li>With nothing in place, the stress day keeps <strong>about {hours(read.bare)} of 24 hours</strong> of service{read.people ? ' for ' + read.people : ''}. With the reference stack, <strong>about {hours(read.withRef ?? 0)}</strong>.</li>}
          </ul>
        </div>
      )}

      {settled && draft && (
        <div className="own-days">
          <ManyDays gauge={settled} stack={[]} compare={{ stack: settled.expert, label: 'the reference stack' }} byId={byId} nameOf={id => settled.system.nodes.find(n => n.id === id)?.name || id} />
        </div>
      )}

      <details className="own-outlier" open={!!(spec.keystone || spec.outlier || spec.lever)}>
        <summary>Read your system like an outlier</summary>
        <p className="sec" style={{ margin: '6px 0 10px' }}>The three questions every known system is read with. Your answers stay with the map and come back on its gauge.</p>
        <label>
          <span className="label">The question it answers for the people it serves</span>
          <input value={spec.keystone || ''} onChange={e => setSpec(sp => ({ ...sp, keystone: e.target.value }))} maxLength={200} placeholder={known ? known.keystoneQuestion : near ? near.system.keystoneQuestion : 'Is the water safe to drink today?'} />
        </label>
        <label>
          <span className="label">The one thing it does better than almost anyone</span>
          <input value={spec.outlier || ''} onChange={e => setSpec(sp => ({ ...sp, outlier: e.target.value }))} maxLength={200} placeholder="What would be hardest for anyone else to copy?" />
        </label>
        <label>
          <span className="label">Where its security has the most leverage</span>
          <input value={spec.lever || ''} onChange={e => setSpec(sp => ({ ...sp, lever: e.target.value }))} maxLength={200} placeholder="The one structure that keeps it whole on its worst day" />
        </label>
      </details>

      <div className="own-foot">
        {problems.length > 0
          ? <span className="sec" style={{ margin: 0 }}>{problems[0]}</span>
          : <span className="sec" style={{ margin: 0 }}>{named.length} parts, {named.reduce((n, p) => n + p.dependsOn.length, 0)} dependencies, {picked.size} threats. Ready to build.</span>}
        <span className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => build(false)} disabled={problems.length > 0}>{editingId ? 'Rebuild the gauge' : 'Build the gauge'}</button>
          <button className="btn btn-key" onClick={() => build(true)} disabled={problems.length > 0}>Build and enter the world</button>
        </span>
      </div>
      {err && <p className="sec" style={{ color: 'var(--ink-alarm)', margin: '8px 0 0' }}>{err}</p>}
    </div>
  );
}
