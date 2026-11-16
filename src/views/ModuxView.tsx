/* MODUX MODELS: the hub.
   The database of security structures, the stacks that compound, the six
   courses, and the web that joins them. Every number on this page is counted
   from the data at render time. */

import React, { useEffect, useMemo, useState } from 'react';
import {
  MODUX_MODELS, MODUX_CATALOG, MODUX_STACKS, MODUX_CHAPTERS, ESSENCE_HEX,
} from '../content/registry';
import {
  FAMILY_LABEL, FAMILY_HUE, TIER_LABEL, type ModuxFamily, type ModuxTier,
} from '../content/modux-schema';
import { useS, type S } from '../lib/state';
import { ModuxWeb } from '../components/ModuxWeb';
import { GAUGES, gaugeOfTheDay } from '../content/modux/gauges';
import { scoreGauge } from '../content/modux/score';
import { forgeGauge, freshSeed } from '../content/modux/forge';
import { BAND_LABEL, bandOf } from '../content/modux-schema';
import type { ModuxGauge, ModuxModel } from '../content/modux-schema';
import { useMotrus } from '../lib/motrus';
import { mindReady, forgeWithClaude, reflectRecord } from '../lib/gaugeMind';
import { GratusCounts } from '../components/Gratus';
import { MotrusMint, VaultGate } from '../components/MotrusMint';
import { MindText } from './ModuxGaugeView';
import { useEngine } from '../lib/engine';
import { chargeKeystone } from '../lib/swarm';
import { serviceRecord, type ServiceLine } from '../lib/service';
import { OwnSystem } from '../components/OwnSystem';
import { ModelTable } from '../components/ModelTable';
import { emojiOf } from '../content/modux/emoji';
import { KnownSystems } from '../components/KnownSystems';
import { KNOWN_SYSTEMS } from '../content/outlier/systems';
import { specFromGauge, specFromKnown } from '../content/modux/own';
import { readRecordFile } from '../lib/share';
import { moduxById } from '../content/registry';
import { localDay } from '../lib/day';
import { PageSigil } from '../components/PageSigil';
import { RiseHead } from '../components/RiseHead';
import { PhoneSelect } from '../components/bits';

type Tab = 'gauges' | 'systems' | 'models' | 'motrus' | 'stacks' | 'courses' | 'web';
const FAMILIES = Object.keys(FAMILY_LABEL) as ModuxFamily[];
const TIERS: ModuxTier[] = ['bedrock', 'proven', 'emerging', 'frontier'];

export function ModuxView() {
  const { s, d } = useS();
  const [tab, setTab] = useState<Tab>((s.route.sub as Tab) || 'gauges');
  const [family, setFamily] = useState<ModuxFamily | 'all'>('all');
  const [tier, setTier] = useState<ModuxTier | 'all'>('all');
  const [q, setQ] = useState((s.route.id || '').startsWith('q:') ? (s.route.id || '').slice(2) : '');
  /* the models as the table of emoji (the default), or as the list of cards; a search arriving from Find opens the list */
  const [shape, setShape] = useState<'table' | 'list'>(q ? 'list' : 'table');
  useEffect(() => { chargeKeystone(); }, [tab]);

  const byIdMap = useMemo(() => new Map(MODUX_MODELS.map(m => [m.id, m])), []);
  const ql = q.trim().toLowerCase();
  const shown = useMemo(() => MODUX_MODELS.filter(m =>
    (family === 'all' || m.family === family) &&
    (tier === 'all' || m.tier === tier) &&
    (!ql || (m.name + ' ' + m.statement + ' ' + m.tags.join(' ') + ' ' + m.defeats.join(' ')).toLowerCase().includes(ql))
  ), [family, tier, ql]);

  const pagesTotal = MODUX_CHAPTERS.reduce((n, c) => n + c.pages.length, 0);
  const pagesDone = MODUX_CHAPTERS.reduce((n, c) => n + c.pages.filter(p => s.completedPages[p.id]).length, 0);
  const stepsDone = MODUX_CHAPTERS.reduce((n, c) => n + c.pages.reduce((k, p) => k + p.steps.filter(st => s.completedSteps[st.id]).length, 0), 0);
  const connections = MODUX_MODELS.reduce((n, m) => n + m.combines.length, 0);

  return (
    <div className="wrap-wide mx">
      <section className="mx-hero mx-glass mx-lit" data-keystone data-essence="#a78bff">
        <span className="hero-sigil" aria-hidden><PageSigil kind="web" /></span>
        <div className="mx-hero-text">
          <span className="mx-kicker">Modux Models</span>
          <RiseHead text="The Structures That Hold." />
          <p className="lede">
            A database of security structures: what each one is, what it defeats, where it fails,
            and what it compounds with. Bedrock patterns, proven ones, the emerging, and the frontier.
          </p>
        </div>
        <div className="mx-tiles mx-tiles-6">
          <div className="mx-tile"><span className="mx-tile-val">{MODUX_MODELS.length}<span className="mx-tile-of">/{MODUX_CATALOG.length}</span></span><span className="mx-tile-label">models</span></div>
          <div className="mx-tile"><span className="mx-tile-val">{FAMILIES.length}</span><span className="mx-tile-label">families</span></div>
          <div className="mx-tile"><span className="mx-tile-val lilac">{connections}</span><span className="mx-tile-label">connections</span></div>
          <div className="mx-tile"><span className="mx-tile-val">{MODUX_STACKS.length}</span><span className="mx-tile-label">stacks</span></div>
          <div className="mx-tile"><span className="mx-tile-val warm">{pagesDone}<span className="mx-tile-of">/{pagesTotal}</span></span><span className="mx-tile-label">pages earned</span></div>
          <button className="mx-tile mx-tile-btn" onClick={() => setTab('systems')}><span className="mx-tile-val">{KNOWN_SYSTEMS.length}</span><span className="mx-tile-label">real systems</span></button>
        </div>
      </section>

      <div className="mx-tabs" role="tablist" aria-label="Modux sections">
        {([['gauges', 'Gauges'], ['systems', 'Systems'], ['models', 'Models'], ['motrus', 'MoTRUS'], ['stacks', 'Stacks'], ['courses', 'Courses'], ['web', 'The Web']] as [Tab, string][]).map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={'mx-tab' + (tab === k ? ' on' : '')}
            onClick={() => setTab(k)}>{label}</button>
        ))}
      </div>

      {tab === 'gauges' && <GaugesTab byId={byIdMap} />}

      {tab === 'systems' && <KnownSystems />}

      {tab === 'motrus' && <MotrusTab />}

      {tab === 'models' && (
        <>
          <div className="mx-chips mx-shape" role="group" aria-label="Show the models as">
            <button type="button" className={'mx-chip' + (shape === 'table' ? ' on' : '')} aria-pressed={shape === 'table'} onClick={() => setShape('table')}>The table</button>
            <button type="button" className={'mx-chip' + (shape === 'list' ? ' on' : '')} aria-pressed={shape === 'list'} onClick={() => setShape('list')}>The list</button>
          </div>
          {shape === 'table' && <ModelTable />}
        </>
      )}

      {tab === 'models' && shape === 'list' && (
        <>
          <div className="mx-filters">
            <PhoneSelect<ModuxFamily | 'all'> label="Family" value={family} options={[{ value: 'all', label: 'All families' }, ...FAMILIES.map(f => ({ value: f, label: FAMILY_LABEL[f] }))]} onChange={setFamily} />
            <div className="mx-chips row-scroll">
              <button className={'mx-chip' + (family === 'all' ? ' on' : '')} onClick={() => setFamily('all')}>All families</button>
              {FAMILIES.map(f => (
                <button key={f} className={'mx-chip' + (family === f ? ' on' : '')}
                  style={{ ['--hue' as string]: ESSENCE_HEX[FAMILY_HUE[f]] }}
                  onClick={() => setFamily(family === f ? 'all' : f)}>{FAMILY_LABEL[f]}</button>
              ))}
            </div>
            <div className="mx-chips">
              <button className={'mx-chip' + (tier === 'all' ? ' on' : '')} onClick={() => setTier('all')}>All tiers</button>
              {TIERS.map(t => (
                <button key={t} className={'mx-chip' + (tier === t ? ' on' : '')} onClick={() => setTier(tier === t ? 'all' : t)}>{TIER_LABEL[t]}</button>
              ))}
              <span className="spacer" />
              <input className="mx-search" value={q} onChange={e => setQ(e.target.value)}
                placeholder="Search models" aria-label="Search models" />
            </div>
          </div>

          <div className="mx-grid">
            {shown.map(m => (
              <button key={m.id} className="mx-card" style={{ ['--hue' as string]: ESSENCE_HEX[FAMILY_HUE[m.family]] }}
                onClick={() => d({ t: 'route', view: 'modux-model', id: m.id })}>
                <span className="mx-card-top">
                  <span className="mx-fam">{FAMILY_LABEL[m.family]}</span>
                  <span className={'mx-tier t-' + m.tier}>{TIER_LABEL[m.tier]}</span>
                </span>
                <h3><span className="mt-e mx-card-e" aria-hidden>{emojiOf(m.id)}</span>{m.name}</h3>
                <p>{m.statement}</p>
                <span className="mx-card-foot">{m.combines.length} connections · {m.minutes} min</span>
              </button>
            ))}
          </div>
          {shown.length === 0 && (
            <div className="mx-empty">
              {MODUX_MODELS.length === 0
                ? 'The models are being written. The catalog below shows what is coming.'
                : 'No model matches that filter.'}
            </div>
          )}
          {MODUX_MODELS.length < MODUX_CATALOG.length && (
            <details className="mx-pending">
              <summary>{MODUX_CATALOG.length - MODUX_MODELS.length} models in the catalog still being written</summary>
              <div className="mx-chips" style={{ marginTop: 12 }}>
                {MODUX_CATALOG.filter(e => !MODUX_MODELS.some(m => m.id === e.id)).map(e => (
                  <span key={e.id} className="mx-chip dim">{e.name}</span>
                ))}
              </div>
            </details>
          )}
        </>
      )}

      {tab === 'stacks' && (
        <div className="mx-grid">
          {MODUX_STACKS.map(st => (
            <button key={st.id} className="mx-card mx-card-stack" style={{ ['--hue' as string]: ESSENCE_HEX[st.essence] }}
              onClick={() => d({ t: 'route', view: 'modux-stack', id: st.id })}>
              <span className="mx-card-top"><span className="mx-fam">Stack</span><span className="mx-tier">{st.models.length} models</span></span>
              <span className="mt-e mx-stack-e" aria-hidden>{st.models.map(id => emojiOf(id)).filter(Boolean).join(' ')}</span>
              <h3>{st.name}</h3>
              <p>{st.statement}</p>
              <span className="mx-card-foot">{st.fits}</span>
            </button>
          ))}
        </div>
      )}

      {tab === 'courses' && (
        <div className="mx-grid mx-grid-2">
          {MODUX_CHAPTERS.map(c => {
            const done = c.pages.filter(p => s.completedPages[p.id]).length;
            const steps = c.pages.reduce((n, p) => n + p.steps.length, 0);
            const stepsIn = c.pages.reduce((n, p) => n + p.steps.filter(st => s.completedSteps[st.id]).length, 0);
            return (
              <button key={c.id} className="mx-card mx-card-course" style={{ ['--hue' as string]: ESSENCE_HEX[c.essence] }}
                onClick={() => d({ t: 'route', view: 'chapter', id: c.id })}>
                <span className="mx-card-top">
                  <span className="mx-fam">Course {c.order - 100}</span>
                  <span className="mx-tier">{done}/{c.pages.length} pages</span>
                </span>
                <h3>{c.title}</h3>
                <p>{c.subtitle}</p>
                <span className="mx-progress" aria-hidden><i style={{ width: steps ? Math.round((stepsIn / steps) * 100) + '%' : '0%' }} /></span>
                <span className="mx-card-foot">{stepsIn}/{steps} models studied · {c.pages.length} pages</span>
              </button>
            );
          })}
        </div>
      )}

      {tab === 'web' && (
        <>
          <PhoneSelect<ModuxFamily | 'all'> label="Family" value={family} options={[{ value: 'all', label: 'All families' }, ...FAMILIES.map(f => ({ value: f, label: FAMILY_LABEL[f] }))]} onChange={setFamily} />
          <div className="mx-chips row-scroll" style={{ marginBottom: 18 }}>
            <button className={'mx-chip' + (family === 'all' ? ' on' : '')} onClick={() => setFamily('all')}>All families</button>
            {FAMILIES.map(f => (
              <button key={f} className={'mx-chip' + (family === f ? ' on' : '')}
                style={{ ['--hue' as string]: ESSENCE_HEX[FAMILY_HUE[f]] }}
                onClick={() => setFamily(family === f ? 'all' : f)}>{FAMILY_LABEL[f]}</button>
            ))}
          </div>
          <div className="mx-glass mx-web-panel">
            <ModuxWeb family={family} />
          </div>
        </>
      )}

      <p className="mx-foot">{stepsDone} models studied in the courses so far.</p>
    </div>
  );
}

/* ---------- the Gauges tab ---------- */

function bandCounts(s: S) {
  const out: Record<string, number> = { ground: 0, hardened: 0, systemic: 0, wicked: 0, outlier: 0 };
  for (const r of Object.values(s.gauges)) for (const [k, lv] of Object.entries(r.levels || {})) if (lv.held) out[bandOf(Number(k))]++;
  return out;
}

/* the service record, computed once per record and read by every card */
const SR_CACHE = new WeakMap<object, Map<string, ServiceLine>>();
function srOf(s: { gauges: object } & Parameters<typeof serviceRecord>[0]): Map<string, ServiceLine> {
  const hit = SR_CACHE.get(s.gauges);
  if (hit) return hit;
  const m = new Map(serviceRecord(s).lines.map(l => [l.id, l]));
  SR_CACHE.set(s.gauges, m);
  return m;
}

/** The record as plain lines for Claude: numbers and titles, nothing private. */
function recordText(s: S): string {
  const lines = s.runLog.slice(-60).map(r =>
    localDay(new Date(r.at).getTime()) + ' | ' + r.title + ' | notch ' + r.notch + ' (' + BAND_LABEL[bandOf(r.notch)] + ') | score ' + r.score +
    ' vs reference ' + r.ref + ' | ' + (r.held ? 'held' : 'breached') + ' | families: ' + r.fams.join(', ') + (r.motrus ? ' | MoTRUS models: ' + r.motrus : ''));
  return [
    'Gratus ' + s.gratus + ', Gratus Gold ' + s.gratusGold + ', runs ' + s.runLog.length,
    'Highest notch held per gauge: ' + Object.entries(s.gauges).map(([id, r]) => id + ' ' + r.top).join(', '),
    ...lines,
  ].join('\n');
}

function GaugesTab({ byId }: { byId: Map<string, ModuxModel> }) {
  const { s, d } = useS();
  const [hint, setHint] = useState('');
  const [busy, setBusy] = useState<'' | 'forge' | 'claude' | 'reflect'>('');
  const [err, setErr] = useState('');
  const [reflection, setReflection] = useState<{ text: string | null; model?: string; error?: string } | null>(null);
  const today = gaugeOfTheDay();
  const mind = mindReady(s.provider);
  /* counted from the gauge records, so runs from before the run log existed still count */
  const records = Object.values(s.gauges);
  const runs = Math.max(s.runLog.length, records.reduce((n, r) => n + (r.runs || 0), 0));
  const holds = records.reduce((n, r) => n + Object.values(r.levels || {}).filter(l => l.held).length, 0);
  const top = Math.max(-1, ...Object.values(s.gauges).map(r => r.top ?? -1));
  const bands = bandCounts(s);
  const famCount = new Map<string, number>();
  for (const r of s.runLog) for (const f of r.fams) famCount.set(f, (famCount.get(f) || 0) + 1);
  /* records from before the run log: read the families from each saved best stack */
  if (s.runLog.length === 0) for (const r of records) for (const id of r.stack || []) {
    const f = byId.get(id)?.family;
    if (f) famCount.set(f, (famCount.get(f) || 0) + 1);
  }
  const leaned = [...famCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f]) => FAMILY_LABEL[f as ModuxFamily] || f);
  const unused = FAMILIES.filter(f => !famCount.has(f)).map(f => FAMILY_LABEL[f]);
  const recent = s.runLog.slice(-18);

  const editId = (s.route.id || '').startsWith('edit:') ? (s.route.id || '').slice(5) : '';
  const editGauge = editId ? s.forged.find(g => g.id === editId) : undefined;
  /* a known system arrives here to be edited before it runs */
  const knownStart = useMemo(() => ((s.route.id || '').startsWith('known:') ? specFromKnown((s.route.id || '').slice(6)) : null), [s.route.id]);
  const [own, setOwn] = useState(!!editGauge || !!knownStart);
  const [fileErr, setFileErr] = useState('');
  /* a file in the open format asks first, like a link */
  async function importFile(f: File | undefined) {
    setFileErr('');
    if (!f) return;
    const rec = readRecordFile(await f.text(), id => !!moduxById(id));
    if (!rec) { setFileErr('That file is not a StepSAFE gauge or run, or its shape could not be read.'); return; }
    window.dispatchEvent(new CustomEvent('stepsafe-offer', { detail: { kind: rec.run ? 'run' : 'gauge', gauge: rec.gauge, run: rec.run, from: 'file' } }));
  }
  function open(g: ModuxGauge) { d({ t: 'route', view: 'modux-gauge', id: g.id }); }
  function forge() {
    setBusy('forge'); setErr('');
    const g = forgeGauge(freshSeed(), byId);
    setBusy('');
    if (!g) { setErr('The forge came up empty. Try again.'); return; }
    d({ t: 'forge-add', gauge: g });
    open(g);
  }
  async function forgeClaude() {
    setBusy('claude'); setErr('');
    const r = await forgeWithClaude(s.provider, byId, hint);
    setBusy('');
    if (!r.gauge) { setErr(r.error || 'Claude did not return a scenario.'); return; }
    d({ t: 'forge-add', gauge: r.gauge });
    open(r.gauge);
  }
  async function reflect() {
    setBusy('reflect');
    setReflection(await reflectRecord(s.provider, recordText(s)));
    setBusy('');
  }

  const srLines = srOf(s);
  const card = (g: ModuxGauge, label: string) => {
    const rec = s.gauges[g.id];
    const line = srLines.get(g.id);
    const sess = s.gaugeSessions[g.id];
    const golds = s.golds.filter(x => x.gauge === g.id).length;
    const ref = scoreGauge(g, g.expert, byId).score;
    return (
      <div key={g.id} className="gx-card-wrap">
        <button className={'mx-card mx-card-trial' + (g.id === today.id ? ' today' : '')}
          style={{ ['--hue' as string]: ESSENCE_HEX[g.essence] || '#a78bff' }} onClick={() => open(g)}>
          <span className="mx-card-top">
            <span className="mx-fam">{label}</span>
            <span className={'mx-tier' + (golds ? ' t-frontier' : rec?.held ? ' t-bedrock' : '')}>
              {golds ? golds + ' Gold' : rec ? (rec.top >= 0 ? 'Held to notch ' + rec.top : 'Breached') : 'Not run'}
            </span>
          </span>
          <h3>{g.title}</h3>
          <p>{g.org}. {g.adversary}.</p>
          <span className="mx-card-foot">
            Budget {g.budget} · {g.threats.length} threats · reference {ref}
            {sess?.used.length ? ' · at notch ' + sess.used.length : ''}
            {rec ? ' · runs ' + rec.runs : ''}
            {line ? <><br />Keeps about {Math.round(line.hoursKept)} of 24 h{line.peopleLabel ? ' for ' + line.peopleLabel : ''}</> : null}
          </span>
        </button>
        {(g.origin === 'forged' || g.origin === 'opus') && (
          <button className="gx-remove" onClick={() => d({ t: 'forge-remove', id: g.id })} aria-label={'Remove ' + g.title}>Remove</button>
        )}
      </div>
    );
  };

  return (
    <>
      <section className="gx-record mx-glass">
        <div className="gx-record-top">
          <div>
            <span className="mx-kicker">Your record</span>
            <h2 style={{ margin: '4px 0 6px' }}>The Steward Record</h2>
            <p className="sec" style={{ margin: 0 }}>
              {runs === 0 ? 'No gauges run yet. Build a stack, run it, then take it up a notch.'
                : runs + (runs === 1 ? ' run · ' : ' runs · ') + holds + (holds === 1 ? ' notch held' : ' notches held') + ' · highest notch held ' + (top >= 0 ? top + ' (' + BAND_LABEL[bandOf(top)] + ')' : 'none yet')}
            </p>
          </div>
          <GratusCounts gratus={s.gratus} gold={s.gratusGold} />
        </div>
        {runs > 0 && (
          <div className="gx-record-grid">
            <div>
              <span className="tr-detail-label">Notches held by band</span>
              <p className="gx-bands-line">
                {(['ground', 'hardened', 'systemic', 'wicked', 'outlier'] as const).map(b => (
                  <span key={b} className={'gx-bandcount b-' + b + (bands[b] ? ' on' : '')}>{BAND_LABEL[b]} <strong>{bands[b]}</strong></span>
                ))}
              </p>
            </div>
            <div>
              <span className="tr-detail-label">You lean on</span>
              <p className="sec" style={{ margin: '4px 0 0' }}>{leaned.join(', ') || 'Your next run fills this in.'}</p>
              {unused.length > 0 && <p className="sec" style={{ margin: '4px 0 0' }}><span className="gx-dim">Not used yet:</span> {unused.slice(0, 6).join(', ')}{unused.length > 6 ? ' and ' + (unused.length - 6) + ' more' : ''}</p>}
            </div>
            <div>
              <span className="tr-detail-label">Recent runs</span>
              {recent.length === 0 && <p className="sec" style={{ margin: '4px 0 0' }}>Your next run starts the strip.</p>}
              <div className="gx-strip" aria-label="Recent runs, taller for higher notches">
                {recent.map((r, i) => (
                  <i key={i} className={r.held ? 'held' : 'lost'} style={{ height: 8 + Math.min(12, r.notch) * 4 + 'px' }}
                    title={r.title + ' · notch ' + r.notch + ' · ' + r.score + (r.held ? ' · held' : ' · breached')} />
                ))}
              </div>
            </div>
          </div>
        )}
        {s.golds.length > 0 && (
          <div className="gx-golds">
            <span className="tr-detail-label">Gratus Gold</span>
            <ul>
              {s.golds.slice(-5).reverse().map((g, i) => (
                <li key={i}><strong>{g.title}</strong> · {g.why === 'beyond' ? 'past the catalog ceiling at notch ' + g.notch : 'notch ' + g.notch + ', ' + g.score + ' against ' + g.ref}</li>
              ))}
            </ul>
          </div>
        )}
        {runs >= 3 && mind && (
          <div style={{ marginTop: 14 }}>
            {reflection?.text ? <MindText text={reflection.text} model={reflection.model} />
              : <button className="btn btn-sm" onClick={reflect} disabled={busy === 'reflect'}>{busy === 'reflect' ? 'Claude is reading your record' : 'Reflect on my record with Claude'}</button>}
            {reflection && !reflection.text && <p className="sec" style={{ color: 'var(--ink-alarm)' }}>{reflection.error}</p>}
          </div>
        )}
      </section>

      <p className="lede" style={{ margin: 'var(--s5) 0 var(--s4)' }}>
        Build a stack from the catalog within a budget and run it against an adversary. When it holds, take it up a notch.
        Each notch adds a pressure. The system map opens at notch 3, the adversary studies you from notch 5,
        and open problems arrive at notch 7.
      </p>

      <div className="gx-forge mx-glass">
        <div>
          <h3 style={{ margin: 0 }}>Forge A New Gauge</h3>
          <p className="sec" style={{ margin: '4px 0 0' }}>A new organisation with new threats from the pressure library, and a budget set so it can be held. Forge as many as you like.</p>
        </div>
        <div className="gx-forge-actions">
          <button className="btn btn-key" onClick={forge} disabled={!!busy}>Forge a gauge</button>
          <button className="btn" onClick={() => setOwn(v => !v)} aria-expanded={own}>Map your own system</button>
          <label className="btn btn-ghost gx-import">
            Import a file
            <input type="file" accept="application/json,.json" onChange={e => { importFile(e.target.files?.[0]); e.currentTarget.value = ''; }} />
          </label>
          {mind && (
            <>
              <input className="mx-search" value={hint} onChange={e => setHint(e.target.value)} maxLength={400}
                placeholder="Optional focus for Claude, such as a county water utility" aria-label="Focus for Claude" />
              <button className="btn" onClick={forgeClaude} disabled={!!busy}>{busy === 'claude' ? 'Claude is writing it' : 'Forge with Claude'}</button>
            </>
          )}
        </div>
        {err && <p className="sec" style={{ color: 'var(--ink-alarm)', margin: 0 }}>{err}</p>}
        {fileErr && <p className="sec" style={{ color: 'var(--ink-alarm)', margin: 0 }}>{fileErr}</p>}
      </div>

      {own && <OwnSystem onClose={() => setOwn(false)} editingId={editGauge ? editGauge.id : undefined} initial={editGauge ? (s.ownSpecs[editGauge.id] || specFromGauge(editGauge)) : knownStart || undefined} />}

      {s.forged.length > 0 && (
        <>
          <h2 style={{ marginTop: 'var(--s5)' }}>Forged</h2>
          <div className="mx-grid mx-grid-trials">
            {s.forged.map(g => card(g, g.seed === 'own' ? (s.ownSpecs[g.id]?.known ? 'A known system' : 'Your system') : g.seed === 'shared' ? 'Shared with you' : g.origin === 'opus' ? 'Forged by Claude' : 'Forged'))}
          </div>
        </>
      )}

      <h2 style={{ marginTop: 'var(--s5)' }}>Authored Gauges</h2>
      <div className="mx-grid mx-grid-trials">
        {[today, ...GAUGES.filter(t => t.id !== today.id)].map(g => card(g, g.id === today.id ? 'Today' : g.org))}
      </div>
    </>
  );
}

/* ---------- the MoTRUS tab ---------- */

function MotrusTab() {
  const v = useMotrus();
  const eng = useEngine();
  const [minting, setMinting] = useState(false);
  const [confirmShred, setConfirmShred] = useState(false);
  return (
    <>
      <p className="lede" style={{ marginBottom: 'var(--s4)' }}>
        MoTRUS models are your own security structures, written in the same shape as the catalog: what each one defeats,
        its parts, and how it fails. Mint them here or inside a gauge from notch 2, put them in a stack, and have Claude review them against the scenario.
      </p>
      <div className="gx-vaultbox mx-glass">
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span>
            <strong>The vault</strong>
            <span className="gx-mt-meta">{v.status === 'open' ? 'Open for this session · ' + v.models.length + (v.models.length === 1 ? ' model' : ' models')
              : v.status === 'locked' ? 'Sealed' : v.status === 'none' ? 'Not created yet' : 'Not available in this browser'}</span>
          </span>
          {v.status === 'open' && (
            <span className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-sm" onClick={() => setMinting(true)}>Mint a MoTRUS model</button>
              <button className="btn btn-ghost btn-sm" onClick={v.lock}>Seal it</button>
              {!confirmShred
                ? <button className="btn btn-ghost btn-sm" onClick={() => setConfirmShred(true)}>Shred the vault</button>
                : <button className="btn btn-sm gx-danger" onClick={() => { v.shred(); setConfirmShred(false); }}>Shred every model for good</button>}
            </span>
          )}
        </div>
        <VaultGate />
        <p className="sec" style={{ margin: '10px 0 0' }}>
          Sealed with AES-GCM under your passphrase, on this device only. The vault stays out of exports, imports and share links.
          Shredding deletes the sealed vault from this device.
        </p>
      </div>
      {minting && v.status === 'open' && (
        <div style={{ marginTop: 'var(--s4)' }}>
          <MotrusMint keepOnly onCancel={() => setMinting(false)} onMinted={() => { setMinting(false); eng.mintedMotrus(); }} />
        </div>
      )}
      {v.status === 'open' && v.models.length > 0 && (
        <div className="mx-grid mx-grid-2" style={{ marginTop: 'var(--s4)' }}>
          {v.models.map(m => {
            const reviews = Object.entries(m.reviews).filter(([k]) => !k.endsWith(':error'));
            return (
              <article key={m.id} className="mx-card gx-mt-card" style={{ ['--hue' as string]: m.family === 'own' ? '#a78bff' : ESSENCE_HEX[FAMILY_HUE[m.family]] }}>
                <span className="mx-card-top">
                  <span className="mx-fam">{m.family === 'own' ? 'Its own family' : FAMILY_LABEL[m.family]}</span>
                  <span className="mx-tier">MoTRUS</span>
                </span>
                <h3>{m.name}</h3>
                <p>{m.statement}</p>
                <details>
                  <summary>Structure and failure</summary>
                  <p className="sec">{m.structure}</p>
                  {m.failsWhen && <p className="sec"><strong>Fails when:</strong> {m.failsWhen}</p>}
                </details>
                {reviews.length > 0 && (
                  <p className="gx-mt-meta">{reviews.map(([k, r]) => {
                    const [g, n] = k.split('@');
                    const title = GAUGES.find(x => x.id === g)?.title || 'a forged gauge';
                    return title + ' notch ' + n + ': ' + r.verdict;
                  }).join(' · ')}</p>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => { if (window.confirm('Delete ' + m.name + '?')) void v.remove(m.id); }}>Delete</button>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
