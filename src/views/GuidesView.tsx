/* STEPGUIDES — the resource hub and the great glossary.
   Statement: a discipline is a shared vocabulary plus usable instruments.
   The guides are grouped by the same eleven subjects as the glossary's terms and the StudyMode deck (content/subjects.ts);
   the glossary itself is components/Glossary.tsx. */

import React, { useEffect, useMemo, useState } from 'react';
import { GUIDES, TERMS, guideById } from '../content/registry';
import { SUBJECTS, guideSubject, type SubjectId } from '../content/subjects';
import { Glossary } from '../components/Glossary';
import { SubjectGlyph } from '../components/SubjectGlyph';
import { useS } from '../lib/state';
import { ReadAloud } from '../components/ReadAloud';
import { passagesOfGuide } from '../lib/reading';
import { useEngine } from '../lib/engine';
import { Blocks } from '../components/Blocks';
import { SectionHead, PhoneSelect } from '../components/bits';
import { chargeKeystone } from '../lib/swarm';
import { RiseHead } from '../components/RiseHead';

const KIND_LABEL: Record<string, string> = {
  playbook: 'Playbook', template: 'Template', checklist: 'Checklist', model: 'Model',
  'field-note': 'Field note', reading: 'Reading path', drillbook: 'Drillbook',
};

export function GuidesView() {
  const { s, d } = useS();
  const eng = useEngine();
  const [tab, setTab] = useState<'guides' | 'glossary'>(s.route.sub ? 'glossary' : 'guides');
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState<SubjectId | 'all'>('all');
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  useEffect(() => { chargeKeystone(); }, [tab, openGuide]);

  /* a link to a guide opens it; a link to a term opens the glossary on it */
  useEffect(() => {
    if (!s.route.id || !guideById(s.route.id)) return;
    setTab('guides');
    setOpenGuide(s.route.id);
  }, [s.route.id]);
  useEffect(() => { if (s.route.sub) setTab('glossary'); }, [s.route.sub]);

  /* the guides, by the same eleven subjects as the glossary and the deck */
  const ql = q.trim().toLowerCase();
  const inQ = useMemo(() => GUIDES.filter(gd => !ql || (gd.title + ' ' + gd.summary + ' ' + gd.statement + ' ' + gd.domain).toLowerCase().includes(ql)), [ql]);
  const subjectCounts = useMemo(() => {
    const m = Object.fromEntries(SUBJECTS.map(x => [x.id, 0])) as Record<SubjectId, number>;
    for (const gd of inQ) { const x = guideSubject(gd); if (x) m[x]++; }
    return m;
  }, [inQ]);
  const guideGroups = useMemo(() => SUBJECTS
    .filter(x => subject === 'all' || x.id === subject)
    .map(x => ({ subject: x, guides: inQ.filter(gd => guideSubject(gd) === x.id) }))
    .filter(x => x.guides.length), [inQ, subject]);
  const guideCount = guideGroups.reduce((n, x) => n + x.guides.length, 0);

  /* guides or the glossary: it sits at the start of the search row in either */
  const switcher = (
    <div className="gs-switch" role="group" aria-label="Guides or the glossary" data-keystone data-essence="#60a5fa">
      <button type="button" className={'gs-tab' + (tab === 'guides' ? ' on' : '')} aria-pressed={tab === 'guides'} onClick={() => setTab('guides')}>
        Guides <b>{GUIDES.length}</b>
      </button>
      <button type="button" className={'gs-tab' + (tab === 'glossary' ? ' on' : '')} aria-pressed={tab === 'glossary'} onClick={() => setTab('glossary')}>
        Glossary <b>{TERMS.length}</b>
      </button>
    </div>
  );

  const g = openGuide ? guideById(openGuide) : undefined;

  if (g) {
    return (
      <div className="wrap">
        <div className="chiprow" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setOpenGuide(null)}>← StepGuides</button>
          <button className="btn btn-ghost btn-sm" onClick={() => d({ t: 'route', view: 'study', id: 'guide:' + g.id })}>Open its card in StudyMode</button>
        </div>
        <section className="band" data-keystone data-essence="#60a5fa">
          <div className="label" style={{ marginBottom: 12 }}>
            {KIND_LABEL[g.kind].toUpperCase()} · {g.domain.toUpperCase()} · {g.minutes} MIN
            {g.mode === 'motus' ? ' · MOTUS' : ''}
          </div>
          <RiseHead text={g.title} style={{ marginBottom: 14 }} />
          <div className="statement" style={{ ['--essence' as string]: '#60a5fa', marginBottom: 'var(--s4)' }}>
            {g.statement}
          </div>
          <p className="lede">{g.summary}</p>
        </section>
        <section className="band" style={{ paddingTop: 0 }}>
          <div className="ra-row" style={{ marginBottom: 'var(--s4)' }}><ReadAloud passages={passagesOfGuide(g)} label="this guide" /><button className="btn btn-ghost btn-sm print-btn" onClick={() => window.print()}>Print</button></div>
          <Blocks blocks={g.blocks} />
        </section>
        <section className="band" style={{ paddingTop: 0 }}>
          <details className="reveal">
            <summary>Sources</summary>
            <div className="reveal-body stack-sm">
              {g.sources.map((src, i) => (
                <div className="blk-callout" key={i}>
                  <strong>{src.label}</strong>
                  <p className="sec" style={{ margin: '6px 0 0' }}>{src.note}</p>
                </div>
              ))}
            </div>
          </details>
          {!s.guidesRead[g.id] && (
            <button className="btn btn-key" style={{ marginTop: 'var(--s4)' }}
              onClick={() => eng.readGuide(g.id)}>
              Mark as read
            </button>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="wrap-wide">
      <SectionHead sigil="path"
        kicker="STEPGUIDES"
        title="The resource hub."
        lede="Playbooks, templates, checklists, models, field notes, reading paths — plus the full glossary of the discipline. The codex, evolved: instruments you actually use."
      />

      {tab === 'glossary' ? <Glossary routeSub={s.route.sub} lead={switcher} /> : (
        <section className="gs" aria-label="The guides">
          <div className="gl-tools">
            <div className="gl-bar">
              {switcher}
              <label className="gl-search">
                <svg viewBox="0 0 24 24" aria-hidden><circle cx="11" cy="11" r="6.4" /><path d="m16 16 4.4 4.4" /></svg>
                <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={'Search ' + GUIDES.length + ' guides'} aria-label="Search the guides" spellCheck={false} autoComplete="off" />
                {q && <button type="button" className="gl-clear" onClick={() => setQ('')}>Clear</button>}
              </label>
            </div>
            <PhoneSelect<SubjectId | 'all'> label="Subject" value={subject}
              options={[{ value: 'all', label: 'Every subject · ' + inQ.length }, ...SUBJECTS.filter(x => subjectCounts[x.id] || subject === x.id).map(x => ({ value: x.id, label: x.name + ' · ' + subjectCounts[x.id] }))]}
              onChange={setSubject} />
            <div className="gl-subjects" role="group" aria-label="Subjects">
              <button type="button" className={'gl-subject' + (subject === 'all' ? ' on' : '')} aria-pressed={subject === 'all'} onClick={() => setSubject('all')}>
                Every subject <b>{inQ.length}</b>
              </button>
              {SUBJECTS.map(x => (
                <button key={x.id} type="button" className={'gl-subject' + (subject === x.id ? ' on' : '')} aria-pressed={subject === x.id}
                  title={x.name} disabled={!subjectCounts[x.id] && subject !== x.id} onClick={() => setSubject(x.id)} style={{ ['--hue' as string]: x.hue }}>
                  <SubjectGlyph id={x.id} size={16} />{x.short} <b>{subjectCounts[x.id]}</b>
                </button>
              ))}
            </div>
            {ql && <p className="gl-caption" aria-live="polite"><span>{guideCount + (guideCount === 1 ? ' guide matches' : ' guides match') + ' “' + q.trim() + '”'}</span></p>}
          </div>

          {guideGroups.map(({ subject: x, guides }) => (
            <section key={x.id} className="gs-subject" style={{ ['--hue' as string]: x.hue }} aria-labelledby={'gs-' + x.id}>
              <header className="gs-subject-head">
                <SubjectGlyph id={x.id} size={22} />
                <div>
                  <h3 id={'gs-' + x.id}>{x.name}</h3>
                  <p>{x.line}</p>
                </div>
                <span className="gs-n">{guides.length === 1 ? 'One guide' : guides.length + ' guides'}</span>
              </header>
              <ul className="gs-list">
                {guides.map(gd => (
                  <li key={gd.id}>
                    <button type="button" className="gs-guide" onClick={() => setOpenGuide(gd.id)}>
                      <span className="gs-meta">
                        <span>{KIND_LABEL[gd.kind]}</span>
                        <span>{gd.minutes} min</span>
                        {s.guidesRead[gd.id] && <span className="gs-read">Read</span>}
                      </span>
                      <strong>{gd.title}</strong>
                      <span className="gs-sum">{gd.summary}</span>
                      <span className="gs-domain">{gd.domain}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {!guideGroups.length && (
            <div className="gl-empty">
              <p>No guide matches “{q.trim()}”{subject !== 'all' ? ' in this subject' : ''}.</p>
              <button type="button" className="btn btn-sm" onClick={() => { if (subject !== 'all' && inQ.length) setSubject('all'); else { setQ(''); setSubject('all'); } }}>
                {subject !== 'all' && inQ.length ? 'Search every subject' : 'Show every guide'}
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
