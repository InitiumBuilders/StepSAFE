/* The pieces of StudyMode: the glyph of each kind of card, the Semble Sound
   meter, a sparkline, the tag editor, the card's systems map, and the field
   signal panel. */

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useS } from '../../lib/state';
import { cardById, neighbours, degree, KIND_HUE, KIND_LABEL, type CardKind } from '../../lib/study/cards';
import { masteryOf, isFud, signed, soundWords } from '../../lib/study/engine';
import { cachedSignal, fetchSignal, signalQuery, researchTrend, type FieldSignal } from '../../lib/study/signal';
import { SOUND_MIN, SOUND_MAX } from '../../lib/state';

/* ---------- the glyph of each kind: drawn, 1.8 stroke ---------- */

export function KindGlyph({ kind, size = 18 }: { kind: CardKind; size?: number }) {
  const c = KIND_HUE[kind];
  const p = { fill: 'none', stroke: c, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className="sg-glyph">
      {kind === 'term' && <><circle cx="12" cy="12" r="8" {...p} /><circle cx="12" cy="12" r="2.4" {...p} /></>}
      {kind === 'model' && <><path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z" {...p} /><path d="M12 8v8M8.5 10l7 4M15.5 10l-7 4" {...p} /></>}
      {kind === 'guide' && <><path d="M5 4.5h9.5a3 3 0 013 3V20H8a3 3 0 01-3-3z" {...p} /><path d="M8.5 9h6M8.5 12.5h6" {...p} /></>}
      {kind === 'step' && <path d="M5 17l5-5-5-5M12 17l5-5-5-5" {...p} />}
      {kind === 'threat' && <><path d="M12 3.5l9 16H3z" {...p} /><path d="M12 10v4.5M12 17.2v.1" {...p} /></>}
      {kind === 'stack' && <><path d="M4 8l8-4 8 4-8 4z" {...p} /><path d="M4 12.5l8 4 8-4M4 16.5l8 4 8-4" {...p} /></>}
      {kind === 'room' && <><path d="M6 21V4h12v17" {...p} /><path d="M14.5 12.5v.1M3 21h18" {...p} /></>}
      {kind === 'incident' && <><circle cx="12" cy="12" r="8.5" {...p} /><path d="M3.5 12h17M12 3.5c3 3.2 3 13.8 0 17M12 3.5c-3 3.2-3 13.8 0 17" {...p} /></>}
    </svg>
  );
}

/* ---------- a sparkline ---------- */

export function Sparkline({ values, w = 120, h = 30, hue = '#b9d8f6', zero }: { values: number[]; w?: number; h?: number; hue?: string; zero?: number }) {
  if (values.length < 2) return null;
  const lo = Math.min(...values, zero ?? Infinity), hi = Math.max(...values, zero ?? -Infinity);
  const span = hi - lo || 1;
  const x = (i: number) => (i / (values.length - 1)) * (w - 4) + 2;
  const y = (v: number) => h - 3 - ((v - lo) / span) * (h - 6);
  const d = values.map((v, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1)).join(' ');
  return (
    <svg className="sg-spark" width={w} height={h} viewBox={'0 0 ' + w + ' ' + h} aria-hidden>
      {zero !== undefined && <line x1="0" x2={w} y1={y(zero)} y2={y(zero)} className="sg-spark-zero" />}
      <path d={d} fill="none" stroke={hue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r="2.6" fill={hue} />
    </svg>
  );
}

/* ---------- the Semble Sound meter: -112 to +112, below 1 the FUD range ---------- */

export function SoundMeter({ value, onCommit, log }: { value?: number; onCommit: (v: number) => void; log?: { v: number }[] }) {
  const [v, setV] = useState<number>(value ?? 0);
  const [touched, setTouched] = useState(typeof value === 'number');
  useEffect(() => { setV(value ?? 0); setTouched(typeof value === 'number'); }, [value]);
  const commit = (x: number) => { setTouched(true); onCommit(x); };
  const pct = ((v - SOUND_MIN) / (SOUND_MAX - SOUND_MIN)) * 100;
  const fud = v < 1;
  return (
    <div className={'sg-meter' + (touched ? '' : ' unset') + (fud ? ' fud' : ' sound')}>
      <div className="sg-meter-head">
        <span className="label">SEMBLE SOUND</span>
        <strong>{touched ? signed(v) : 'Not rated'}</strong>
        <em>{touched ? soundWords(v) : 'How sound do you hold this, from −112 to +112?'}</em>
      </div>
      <div className="sg-meter-track" style={{ ['--pct' as string]: pct + '%' }}>
        <span className="sg-meter-fud" aria-hidden />
        <input type="range" min={SOUND_MIN} max={SOUND_MAX} step={1} value={v}
          aria-label="Semble Sound, from minus 112 to plus 112; below 1 is the FUD range" aria-valuetext={signed(v) + ', ' + soundWords(v)}
          onChange={e => setV(parseInt(e.target.value, 10))}
          onPointerUp={e => commit(parseInt((e.target as HTMLInputElement).value, 10))}
          onKeyUp={e => commit(parseInt((e.target as HTMLInputElement).value, 10))}
          onBlur={e => { if (parseInt(e.target.value, 10) !== value) commit(parseInt(e.target.value, 10)); }} />
      </div>
      <div className="sg-meter-scale" aria-hidden><span>{'−'}112</span><span className="fudl">FUD range</span><span>0</span><span className="soundl">Semble Sound</span><span>+112</span></div>
      <div className="sg-meter-chips">
        {[-112, -56, 0, 28, 56, 84, 112].map(x => (
          <button key={x} type="button" className={'chip' + (touched && v === x ? ' on' : '')} onClick={() => { setV(x); commit(x); }}>{signed(x)}</button>
        ))}
        {log && log.length > 1 && <span className="sg-meter-trend"><Sparkline values={log.map(l => l.v)} w={90} h={26} hue={fud ? '#e8786a' : '#a78bff'} zero={0} /></span>}
      </div>
    </div>
  );
}

/* ---------- tags ---------- */

export function TagEditor({ tags, suggestions, onChange }: { tags: string[]; suggestions: string[]; onChange: (t: string[]) => void }) {
  const [draft, setDraft] = useState('');
  const add = (t: string) => { const x = t.trim().toLowerCase(); if (x && !tags.includes(x)) onChange([...tags, x]); setDraft(''); };
  const rest = [...new Set(suggestions)].filter(s => !tags.includes(s)).slice(0, 8);
  return (
    <div className="sg-tags">
      <div className="chiprow">
        {tags.map(t => (
          <span key={t} className="chip on sg-tag">#{t}<button type="button" onClick={() => onChange(tags.filter(x => x !== t))} aria-label={'Remove the tag ' + t}>×</button></span>
        ))}
        <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Add a tag" maxLength={32}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(draft); } }} aria-label="Add a tag" />
      </div>
      {rest.length > 0 && (
        <div className="chiprow sg-tag-suggest">
          {rest.map(t => <button type="button" key={t} className="chip" onClick={() => add(t)}>+ {t}</button>)}
        </div>
      )}
    </div>
  );
}

/* ---------- the card's systems map: what it is joined to ----------
   Drawn in the box's own pixels, so a label is the same size on a phone and on a wide screen and always fits:
   each label wraps onto two lines inside the room its side of the ring leaves, and a phone shows ten neighbours
   instead of fourteen so the ring keeps its spacing. */

/** a title in lines of at most `max` characters, at most `lines` of them, the last one cut with an ellipsis */
function wrapLabel(title: string, max: number, lines = 2): string[] {
  const out: string[] = [];
  let cur = '';
  for (const word of title.split(/\s+/)) {
    const next = cur ? cur + ' ' + word : word;
    if (next.length <= max || !cur) { cur = next; continue; }
    out.push(cur); cur = word;
  }
  if (cur) out.push(cur);
  const kept = out.slice(0, lines).map(l => (l.length > max + 2 ? l.slice(0, max) + '\u2026' : l));
  if (out.length > lines) kept[lines - 1] = kept[lines - 1].replace(/\u2026$/, '').slice(0, Math.max(1, max - 1)) + '\u2026';
  return kept;
}

export function CardMap({ id, onOpen }: { id: string; onOpen: (id: string) => void }) {
  const { s } = useS();
  const card = cardById(id)!;
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(560);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const set = () => setW(Math.max(280, Math.round(el.getBoundingClientRect().width)));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const small = W < 520;
  const cap = small ? 10 : 14;
  const ns = useMemo(() => {
    const all = neighbours(id).map(n => cardById(n)!).filter(Boolean);
    /* the met ones first, then the most joined */
    return all.sort((a, b) => (masteryOf(s.study[b.id]) !== 'new' ? 1 : 0) - (masteryOf(s.study[a.id]) !== 'new' ? 1 : 0) || degree(b.id) - degree(a.id)).slice(0, cap);
  }, [id, s.study, cap]);
  const total = neighbours(id).length;
  const H = small ? 380 : 420, cx = W / 2, cy = H / 2;
  const rx = Math.min(W * (small ? 0.2 : 0.24), 200), ry = Math.min(H / 2 - 64, 146);
  /* a wide card sets its labels a size up; CH is the face's average character width at that size */
  const LINE = small ? 15 : 16, CH = small ? 6.6 : 7.1;
  const at = (i: number) => {
    const a = (i / Math.max(1, ns.length)) * Math.PI * 2 - Math.PI / 2;
    return { a, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry };
  };
  return (
    <div className="sg-map" ref={box}>
      <svg viewBox={'0 0 ' + W + ' ' + H} width={W} height={H} className={small ? undefined : 'wide'} role="group" aria-label={'What ' + card.title + ' is joined to'}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className="sg-map-orbit" />
        <ellipse cx={cx} cy={cy} rx={rx + 30} ry={ry + 30} className="sg-map-orbit faint" />
        {ns.map((n, i) => {
          const { x, y } = at(i);
          return <line key={'l' + n.id} x1={cx} y1={cy} x2={x} y2={y} className="sg-map-edge" style={{ ['--hue' as string]: KIND_HUE[n.kind], animationDelay: i * 40 + 'ms' }} />;
        })}
        {ns.map((n, i) => {
          const { a, x, y } = at(i);
          const st = s.study[n.id];
          const m = masteryOf(st);
          const c = Math.cos(a), sn = Math.sin(a);
          const anchor = c > 0.25 ? 'start' : c < -0.25 ? 'end' : 'middle';
          const lx = anchor === 'start' ? x + 13 : anchor === 'end' ? x - 13 : x;
          const room = anchor === 'start' ? W - lx - 6 : anchor === 'end' ? lx - 6 : Math.min(190, 2 * Math.min(lx, W - lx) - 12);
          const lines = wrapLabel(n.title, Math.max(6, Math.floor(room / CH)));
          const first = anchor !== 'middle' ? y + 4 - ((lines.length - 1) * LINE) / 2 : sn < 0 ? y - 16 - (lines.length - 1) * LINE : y + 25;
          return (
            <g key={n.id} className={'sg-map-node m-' + m + (isFud(st) ? ' fud' : '')} style={{ ['--hue' as string]: KIND_HUE[n.kind], animationDelay: 120 + i * 40 + 'ms' }}
              role="button" tabIndex={0} aria-label={KIND_LABEL[n.kind] + ': ' + n.title}
              onClick={() => onOpen(n.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(n.id); } }}>
              <circle cx={x} cy={y} r="16" className="hit" />
              <circle cx={x} cy={y} r="6.5" className="dot" />
              <text x={lx} y={first} textAnchor={anchor}>{lines.map((l, k) => <tspan key={k} x={lx} dy={k ? LINE : 0}>{l}</tspan>)}</text>
            </g>
          );
        })}
        <g className="sg-map-core" style={{ ['--hue' as string]: KIND_HUE[card.kind] }}>
          <circle cx={cx} cy={cy} r="22" className="halo" />
          <circle cx={cx} cy={cy} r="11" className="dot" />
        </g>
      </svg>
      <p className="sec">{total === 0 ? 'Nothing in the deck is joined to this card yet.' : 'Joined to ' + total + (total === 1 ? ' card' : ' cards') + (total > ns.length ? '; the ' + ns.length + ' shown are the ones you have met and the most joined.' : '.') + ' A ring marks a card you hold; coral marks one in your FUD range.'}</p>
    </div>
  );
}

/* ---------- the field signal ---------- */

const fmt = (n: number) => n >= 10000 ? Math.round(n / 1000) + 'k' : n.toLocaleString();

export function FieldSignalPanel({ title }: { title: string }) {
  const [query, setQuery] = useState(signalQuery(title));
  const [sig, setSig] = useState<FieldSignal | null>(() => cachedSignal(signalQuery(title)));
  const [busy, setBusy] = useState(false);
  useEffect(() => { const q = signalQuery(title); setQuery(q); setSig(cachedSignal(q)); }, [title]);
  async function read() {
    setBusy(true);
    try { setSig(await fetchSignal(query)); } finally { setBusy(false); }
  }
  const trend = sig ? researchTrend(sig) : null;
  return (
    <div className="sg-signal">
      <div className="sg-signal-head">
        <input value={query} onChange={e => setQuery(e.target.value)} aria-label="The phrase to measure" maxLength={80} />
        <button className="btn btn-sm" onClick={read} disabled={busy || !query.trim()}>{busy ? 'Reading the field' : sig ? 'Read it again' : 'Read the field signal'}</button>
      </div>
      <p className="sec sg-signal-note">Your browser asks Wikipedia, Hacker News, Stack Exchange and OpenAlex about this phrase and nothing else. Google Trends, Reddit and AI chat logs publish no open data a page can read, so they are not here.</p>
      {sig && (
        <div className="sg-signal-grid">
          <div className="sg-sig">
            <span className="label">READ ON WIKIPEDIA</span>
            {sig.wiki ? <><strong>{fmt(sig.wiki.total)}</strong><em>views in 12 months of "{sig.wiki.title}"</em><Sparkline values={sig.wiki.months.map(m => m.views)} hue="#b9d8f6" /></> : <em>No article found</em>}
          </div>
          <div className="sg-sig">
            <span className="label">DISCUSSED ON HACKER NEWS</span>
            {sig.hn ? <><strong>{fmt(sig.hn.all)}</strong><em>stories, {fmt(sig.hn.year)} in the last year</em></> : <em>Not reached</em>}
          </div>
          <div className="sg-sig">
            <span className="label">ASKED ON SECURITY STACK EXCHANGE</span>
            {sig.se ? <><strong>{fmt(sig.se.total)}</strong><em>questions</em></> : <em>Not reached</em>}
          </div>
          <div className="sg-sig">
            <span className="label">RESEARCHED (OPENALEX)</span>
            {sig.research ? <><strong>{fmt(sig.research.total)}</strong><em>papers{trend !== null ? ', ' + (trend >= 0 ? 'up ' : 'down ') + Math.abs(Math.round(trend * 100)) + '% last year' : ''}</em><Sparkline values={sig.research.years.map(y => y.count)} hue="#fdc26f" /></> : <em>Not reached</em>}
          </div>
          <p className="sec sg-signal-asof">Measured for "{sig.query}" on {new Date(sig.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}{sig.errors.length ? '. Not reached: ' + sig.errors.join(', ') : ''}. Counts are matches for the phrase, not a measure of importance.</p>
        </div>
      )}
    </div>
  );
}
