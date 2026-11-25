/* THE GLOSSARY. The discipline's terms in eleven subjects (content/subjects.ts), listed A to Z, with the open term
   held beside the list, so opening one leaves the list as it is. On a wide screen the term stays in view
   while the list scrolls under it; on a phone the list opens into the term, and Back returns to the same place
   in the list. The arrow keys move through the list, and a search ranks the terms whose names match first.

   A term shows its definition, its other names, why it matters, the source an outside fact was read at, the
   entries related to it, the Steps that teach it and the Steps and guides that use it, and its StudyMode card.

   Colour names the subject. Each row starts with its subject's mark, the open term's edge is lit in its subject's
   colour, and the related entries hang from the term as a small web (TermWeb), each line ending in its entry's
   subject colour, so a link into another subject shows as a change of colour.

   A link to a word the glossary has no entry for opens a page for that word in the same place. It says there is
   no entry, and shows what the corpus says: the entries that explain the phrase and the Steps and guides that use
   it, each with the sentence (lib/terms.ts). A different term is not shown in its place. */

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { TERMS, exactTerm } from '../content/registry';
import type { Term } from '../content/schema';
import { SUBJECTS, termSubject, subjectById, type SubjectId } from '../content/subjects';
import { SubjectGlyph } from './SubjectGlyph';
import { lookup, placesOf, phraseFinder, type Place } from '../lib/terms';
import { useS } from '../lib/state';
import { PhoneSelect } from './bits';

const letterOf = (s: string) => { const c = s.trim().charAt(0).toUpperCase(); return c >= 'A' && c <= 'Z' ? c : '#'; };
const LETTERS = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const NARROW = '(max-width: 899px)';

function useNarrow() {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(NARROW).matches);
  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return m;
}

/* a search ranks the names that start with it, then the names that hold it, then the entries that answer to it by
   another name, then the one-line meanings. A row shows only an entry's own name, so a match by another name
   comes after every row whose name the learner can see holds the search (since 2026-11-25: "Key Revocation" had
   put Revocation among the names that start with "key"). */
function search(sorted: Term[], ql: string): Term[] {
  const toks = ql.split(/\s+/).filter(Boolean);
  const rank = (t: Term) => {
    const name = t.term.toLowerCase();
    const others = (t.aliases || []).map(n => n.toLowerCase());
    if (name.startsWith(ql)) return 0;
    if (name.includes(ql)) return 1;
    if (toks.every(w => name.includes(w))) return 2;
    if (others.some(n => n.startsWith(ql))) return 3;
    if (others.some(n => n.includes(ql))) return 4;
    if (others.some(n => toks.every(w => n.includes(w)))) return 5;
    if (toks.every(w => t.short.toLowerCase().includes(w))) return 6;
    return 7;
  };
  return sorted
    .filter(t => { const hay = (t.term + ' ' + (t.aliases || []).join(' ') + ' ' + t.id + ' ' + t.short + ' ' + t.long + ' ' + t.domain).toLowerCase(); return toks.every(w => hay.includes(w)); })
    .map(t => ({ t, r: rank(t) }))
    .sort((a, b) => a.r - b.r)
    .map(x => x.t);
}

/** the other name a search found an entry by, when its own name does not hold the search; its row shows that name,
    as Find and the StudyMode deck do */
function viaName(t: Term, ql: string): string | undefined {
  if (!ql || !t.aliases?.length) return undefined;
  const name = t.term.toLowerCase();
  const toks = ql.split(/\s+/).filter(Boolean);
  if (name.includes(ql) || toks.every(w => name.includes(w))) return undefined;
  return t.aliases.find(n => n.toLowerCase().includes(ql)) || t.aliases.find(n => toks.every(w => n.toLowerCase().includes(w)));
}

const subjectOf = (t: Term): SubjectId => termSubject(t) || 'systems';

/** The related entries as a small web: the open term is the node on the left, and a line runs from it to each entry,
    fading from the term's subject colour to the entry's. The lines grow out of the node when a term opens, and the
    line to an entry brightens while that entry has the pointer or the focus. The entries are ordinary buttons; the
    drawing is measured from where they sit, so a name that wraps moves its line with it. The first seven show at once
    and the rest wait behind a button, as a Step's lists do; the web then redraws to take them in, and the focus moves
    to the first entry that was waiting. */
const WEB_FIRST = 7;
function TermWeb({ hue, terms, onPick }: { hue: string; terms: Term[]; onPick: (id: string) => void }) {
  /* an id safe inside url(#...) whatever form React gives it */
  const uid = 'gw' + useId().replace(/[^a-zA-Z0-9]/g, '') + '-';
  const box = useRef<HTMLDivElement>(null);
  const [all, setAll] = useState(false);
  const shown = useMemo(() => (all ? terms : terms.slice(0, WEB_FIRST)), [all, terms]);
  const [geo, setGeo] = useState<{ h: number; ys: number[] } | null>(null);
  const [hot, setHot] = useState(-1);
  const focusWaiting = useRef(false);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const ys = [...el.querySelectorAll<HTMLElement>(':scope > .gl-chip')].map(c => Math.round(c.offsetTop + c.offsetHeight / 2));
      setGeo(g => (g && g.h === el.offsetHeight && g.ys.join() === ys.join() ? g : { h: el.offsetHeight, ys }));
    };
    measure();
    if (focusWaiting.current) { focusWaiting.current = false; el.querySelectorAll<HTMLElement>(':scope > .gl-chip')[WEB_FIRST]?.focus(); }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [shown]);
  const ready = geo && geo.ys.length === shown.length;
  const mid = ready ? (geo.ys[0] + geo.ys[geo.ys.length - 1]) / 2 : 0;
  return (
    <>
      <div ref={box} className="gl-web" style={{ ['--hue' as string]: hue }}>
        {ready && (
          <svg className="gl-web-lines" width="58" height={geo.h} viewBox={'0 0 58 ' + geo.h} aria-hidden>
            <defs>
              {shown.map((t, i) => (
                <linearGradient key={t.id} id={uid + i} gradientUnits="userSpaceOnUse" x1="8" y1="0" x2="52" y2="0">
                  <stop offset="0" style={{ ['--c' as string]: hue }} />
                  <stop offset="1" style={{ ['--c' as string]: subjectById(subjectOf(t)).hue }} />
                </linearGradient>
              ))}
            </defs>
            {shown.map((t, i) => <path key={t.id} className={hot === i ? 'lit' : undefined} stroke={'url(#' + uid + i + ')'} d={'M8 ' + mid + 'C30 ' + mid + ' 28 ' + geo.ys[i] + ' 52 ' + geo.ys[i]} />)}
            <circle className="gl-web-halo" cx="8" cy={mid} r="9" />
            <circle className="gl-web-node" cx="8" cy={mid} r="4.2" />
          </svg>
        )}
        {shown.map((t, i) => (
          <button key={t.id} type="button" className="gl-chip" style={{ ['--hue' as string]: subjectById(subjectOf(t)).hue }} onClick={() => onPick(t.id)}
            onPointerEnter={() => setHot(i)} onPointerLeave={() => setHot(h => (h === i ? -1 : h))} onFocus={() => setHot(i)} onBlur={() => setHot(h => (h === i ? -1 : h))}>
            <SubjectGlyph id={subjectOf(t)} size={16} />{t.term}
          </button>
        ))}
      </div>
      {terms.length > shown.length && (
        <button type="button" className="btn btn-ghost btn-sm gl-more" onClick={() => { focusWaiting.current = true; setAll(true); }}>
          Show the other {terms.length - shown.length}
        </button>
      )}
    </>
  );
}

/** the other names worth showing: one that only shortens the entry's name or a longer other name is left out */
function shownAliases(t: Term): string[] {
  const all = t.aliases || [];
  const low = (s: string) => s.toLowerCase();
  return all.filter(a => !low(t.term).startsWith(low(a)) && !all.some(b => b !== a && low(b).startsWith(low(a))));
}

/** a sentence with the phrase it was found for marked */
function Marked({ text, phrase }: { text: string; phrase: string }) {
  const m = phraseFinder(phrase)?.exec(text);
  if (!m) return <>{text}</>;
  return <>{text.slice(0, m.index)}<mark className="gl-mark">{m[0]}</mark>{text.slice(m.index + m[0].length)}</>;
}

/** lead: what sits before the search on its row, the switch between the guides and the glossary */
export function Glossary({ routeSub, lead }: { routeSub?: string; lead?: React.ReactNode }) {
  const { s, d } = useS();
  const narrow = useNarrow();
  /* a Step written for Motus opens on a gate for a Novus learner, so its row says so first */
  const gate = (p: { motus?: boolean }) => (p.motus && s.mode === 'novus' ? 'Motus · ' : '');
  const [q, setQ] = useState('');
  const [subject, setSubject] = useState<SubjectId | 'all'>('all');
  const [sel, setSel] = useState<string | null>(null);
  /* a word with no entry, shown in the term's place */
  const [phrase, setPhrase] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState<Record<string, boolean>>({});
  const rootRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  /* where the list was when a term opened on a phone; a link that opened a term directly has none */
  const listY = useRef(-1);
  const pendingRow = useRef<{ id: string; block: ScrollLogicalPosition; focus: boolean } | null>(null);
  /* set when something was just opened: the next render brings the open term fully into view */
  const reveal = useRef(false);

  /* the app's own bar sits on top on a narrower screen; the glossary's strip and the open term sit under it */
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('.nav');
    const el = rootRef.current;
    if (!el) return;
    const set = () => {
      const cs = nav ? getComputedStyle(nav) : null;
      const top = nav && cs && cs.position === 'sticky' && cs.flexDirection === 'row' ? nav.getBoundingClientRect().height : 0;
      el.style.setProperty('--gl-nav', Math.round(top) + 'px');
    };
    set();
    const ro = nav ? new ResizeObserver(set) : null;
    if (nav) ro!.observe(nav);
    window.addEventListener('resize', set);
    return () => { ro?.disconnect(); window.removeEventListener('resize', set); };
  }, []);

  /* a link to a term opens it; a link to a word with no entry opens that word's page */
  useEffect(() => {
    if (!routeSub) return;
    const t = exactTerm(routeSub);
    setQ(''); setSubject('all'); setOpen(true);
    if (t) { setPhrase(null); setSel(t.id); pendingRow.current = { id: t.id, block: 'center', focus: false }; }
    else { setSel(null); setPhrase(routeSub); }
    reveal.current = true;
  }, [routeSub]);

  const sorted = useMemo(() => [...TERMS].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' })), []);
  const ql = q.trim().toLowerCase();
  const inQ = useMemo(() => (ql ? search(sorted, ql) : sorted), [sorted, ql]);
  const shown = useMemo(() => (subject === 'all' ? inQ : inQ.filter(t => termSubject(t) === subject)), [inQ, subject]);
  const counts = useMemo(() => {
    const m = Object.fromEntries(SUBJECTS.map(s => [s.id, 0])) as Record<SubjectId, number>;
    for (const t of inQ) { const s = termSubject(t); if (s) m[s]++; }
    return m;
  }, [inQ]);
  const groups = useMemo(() => {
    if (ql) return [['', shown] as [string, Term[]]];
    const m = new Map<string, Term[]>();
    for (const t of shown) { const L = letterOf(t.term); if (!m.has(L)) m.set(L, []); m.get(L)!.push(t); }
    return [...m];
  }, [shown, ql]);
  const present = useMemo(() => new Set(groups.map(([L]) => L)), [groups]);

  /* the term in front: the one chosen, or on a wide screen the first in the list, unless a word with no entry is showing */
  const chosen = sel ? TERMS.find(t => t.id === sel) : undefined;
  const current = phrase ? undefined : chosen || (!narrow ? shown[0] : undefined);
  const at = current ? shown.findIndex(t => t.id === current.id) : -1;
  const reading = narrow && open && (!!current || !!phrase);
  const said = useMemo(() => (phrase ? lookup(phrase) : null), [phrase]);
  const places = useMemo(() => (current ? placesOf(current) : null), [current]);

  useEffect(() => setMore({}), [current?.id, phrase]);

  /* after a render that moved the selection, bring its row into view; Back on a phone returns to where the list was */
  useLayoutEffect(() => {
    if (reading) return;
    const p = pendingRow.current;
    if (!p) return;
    pendingRow.current = null;
    const row = document.getElementById('gl-row-' + p.id);
    if (!row) return;
    if (narrow && p.block === 'start' && listY.current >= 0) window.scrollTo({ top: listY.current });
    else row.scrollIntoView({ block: p.block === 'start' ? 'center' : p.block });
    if (p.focus) row.focus({ preventScroll: true });
  });
  /* What was just opened comes fully into view. On a phone the term starts under the bar. On a wide screen the
     page moves up until the term reaches the place it holds while the list scrolls, so its card and the way on
     are on screen; it moves only when they are not.
     A view arrives sliding up 12px (view-in, styles/field.css). scrollIntoView aims at the box while it moves, so on
     a phone the term landed 12px high once the view settled, past the top of any page long enough to scroll. The
     phone scroll aims at the offset chain instead, which ignores the slide. */
  useLayoutEffect(() => {
    if (!reveal.current) return;
    reveal.current = false;
    const el = detailRef.current;
    if (!el) return;
    if (narrow) {
      let y = 0;
      for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
      window.scrollTo({ top: Math.max(0, y - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0)) });
      return;
    }
    const held = parseFloat(getComputedStyle(el).top) || 0;
    const r = el.getBoundingClientRect();
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'calm';
    if (r.top > held + 24 && r.bottom > window.innerHeight) window.scrollBy({ top: r.top - held, behavior: calm ? 'auto' : 'smooth' });
  });

  function pick(id: string, focus = false) {
    /* a term reached from a word's page or a related term may be outside the subject or the search in force */
    if (!shown.some(t => t.id === id)) { setQ(''); setSubject('all'); }
    setSel(id); setPhrase(null);
    reveal.current = true;
    if (narrow) {
      if (!open) listY.current = window.scrollY;
      setOpen(true);
      return;
    }
    detailRef.current?.scrollTo({ top: 0 });
    pendingRow.current = { id, block: 'nearest', focus };
  }
  function back() {
    const id = current?.id;
    setOpen(false); setPhrase(null);
    if (id) pendingRow.current = { id, block: 'start', focus: true };
  }
  function onListKey(e: React.KeyboardEvent) {
    if (!shown.length) return;
    /* the list is one tab stop: on a phone nothing is open yet, so the first arrow lands on the row that has focus */
    const from = at >= 0 ? at : Math.max(0, shown.findIndex(t => 'gl-row-' + t.id === (document.activeElement as HTMLElement | null)?.id));
    const go = e.key === 'ArrowDown' ? Math.min(shown.length - 1, at < 0 ? from : at + 1)
      : e.key === 'ArrowUp' ? Math.max(0, (at < 0 ? from : at) - 1)
      : e.key === 'Home' ? 0 : e.key === 'End' ? shown.length - 1 : null;
    if (go === null) return;
    e.preventDefault();
    const id = shown[go].id;
    if (narrow) { setSel(id); pendingRow.current = { id, block: 'nearest', focus: true }; return; }
    pick(id, true);
  }
  function jump(L: string) {
    document.getElementById('gl-letter-' + L)?.scrollIntoView({ block: 'start' });
  }
  function setSubjectTo(s: SubjectId | 'all') {
    setSubject(s); setSel(null); setPhrase(null);
  }
  const go = (p: { kind: 'step' | 'guide'; id: string }) => d(p.kind === 'step' ? { t: 'route', view: 'step', id: p.id } : { t: 'route', view: 'guides', id: p.id });

  const strip = !reading && !ql && shown.length > 0;
  const where = current ? termSubject(current) : undefined;
  /* related entries only: a related word with no entry is not shown as a term */
  const related = useMemo(() => (current ? [...new Set(current.related.map(r => exactTerm(r)).filter((t): t is Term => !!t && t.id !== current.id))] : []), [current]);
  const aka = current ? shownAliases(current) : [];
  const searchSaid = useMemo(() => (ql && !shown.length ? lookup(q.trim()) : null), [ql, shown.length, q]);

  /* a list of places, five at first */
  const placeList = (key: string, label: string, list: Place[]) => list.length > 0 && (
    <div className="gl-sec" data-places={key}>
      <span className="label">{label}</span>
      <ul className="gl-taught">
        {(more[key] ? list : list.slice(0, 5)).map(p => (
          <li key={p.kind + p.id}>
            <button type="button" onClick={() => go(p)}>
              <span><strong>{p.title}</strong><em>{p.kind === 'guide' ? 'StepGuide · ' + p.where : gate(p) + p.where}</em></span>
              <svg viewBox="0 0 24 24" aria-hidden><path d="m9.5 6 6 6-6 6" /></svg>
            </button>
          </li>
        ))}
      </ul>
      {list.length > 5 && !more[key] && <button type="button" className="btn btn-ghost btn-sm gl-more" onClick={() => setMore(m => ({ ...m, [key]: true }))}>Show the other {list.length - 5}</button>}
    </div>
  );

  return (
    <section ref={rootRef} className={'gl' + (narrow ? ' is-narrow' : ' is-wide') + (reading ? ' is-reading' : '') + (strip ? ' has-strip' : '')} aria-label="The glossary">
      {!reading && (
        <div className="gl-tools">
          <div className="gl-bar">
            {lead}
            <label className="gl-search">
              <svg viewBox="0 0 24 24" aria-hidden><circle cx="11" cy="11" r="6.4" /><path d="m16 16 4.4 4.4" /></svg>
              <input type="search" value={q} onChange={e => { setQ(e.target.value); setSel(null); setPhrase(null); }}
                placeholder={'Search ' + TERMS.length + ' terms'} aria-label="Search the glossary" spellCheck={false} autoComplete="off" />
              {q && <button type="button" className="gl-clear" onClick={() => { setQ(''); setSel(null); }}>Clear</button>}
            </label>
          </div>
          <PhoneSelect<SubjectId | 'all'> label="Subject" value={subject}
            options={[{ value: 'all', label: 'Every subject · ' + inQ.length }, ...SUBJECTS.filter(x => counts[x.id] || subject === x.id).map(x => ({ value: x.id, label: x.name + ' · ' + counts[x.id] }))]}
            onChange={setSubjectTo} />
          <div className="gl-subjects" role="group" aria-label="Subjects">
            <button type="button" className={'gl-subject' + (subject === 'all' ? ' on' : '')} aria-pressed={subject === 'all'} onClick={() => setSubjectTo('all')}>
              Every subject <b>{inQ.length}</b>
            </button>
            {SUBJECTS.map(s => (
              <button key={s.id} type="button" className={'gl-subject' + (subject === s.id ? ' on' : '')} aria-pressed={subject === s.id}
                title={s.name} disabled={!counts[s.id] && subject !== s.id} onClick={() => setSubjectTo(s.id)} style={{ ['--hue' as string]: s.hue }}>
                <SubjectGlyph id={s.id} size={16} />{s.short} <b>{counts[s.id]}</b>
              </button>
            ))}
          </div>
          {(subject !== 'all' || ql) && (
            <p className="gl-caption" aria-live="polite">
              {subject !== 'all' && <><strong>{subjectById(subject).name}.</strong> {subjectById(subject).line} </>}
              <span>{ql ? shown.length + (shown.length === 1 ? ' term matches' : ' terms match') + ' “' + q.trim() + '”' : shown.length + ' terms, A to Z'}</span>
            </p>
          )}
        </div>
      )}

      {strip && (
        <nav className="gl-letters" aria-label="Jump to a letter">
          {LETTERS.filter(L => present.has(L)).map(L => (
            <button key={L} type="button" onClick={() => jump(L)}
              aria-label={L === '#' ? 'Terms that start with a number' : 'Terms under ' + L}>{L}</button>
          ))}
        </nav>
      )}

      <div className="gl-body">
        {!reading && (
          shown.length ? (
            <div className="gl-list" onKeyDown={onListKey} aria-label="Terms, A to Z; the arrow keys move through them">
              {groups.map(([L, ts]) => (
                <div key={L || 'found'} className="gl-group">
                  {L && <h3 id={'gl-letter-' + L} className="gl-letter">{L}</h3>}
                  <ul>
                    {ts.map(t => (
                      <li key={t.id}>
                        <button type="button" id={'gl-row-' + t.id} className={'gl-row' + (current?.id === t.id ? ' on' : '')}
                          aria-current={current?.id === t.id ? 'true' : undefined} onClick={() => pick(t.id)}
                          tabIndex={t.id === (shown[at] || shown[0])?.id ? 0 : -1}
                          style={{ ['--hue' as string]: subjectById(subjectOf(t)).hue }}>
                          <SubjectGlyph id={subjectOf(t)} size={16} />
                          <strong>{t.term}</strong>
                          <span>{(() => { const via = viaName(t, ql); return via ? 'Also called ' + via : t.short; })()}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="gl-empty">
              <p>No term matches “{q.trim()}”{subject !== 'all' ? ' in this subject' : ''}.</p>
              <div className="gl-chips">
                <button type="button" className="btn btn-sm" onClick={() => { if (subject !== 'all' && inQ.length) setSubjectTo('all'); else { setQ(''); setSubjectTo('all'); } }}>
                  {subject !== 'all' && inQ.length ? 'Search every subject' : 'Show every term'}
                </button>
                {searchSaid && searchSaid.uses.length > 0 && (
                  <button type="button" className="btn btn-sm" onClick={() => { setPhrase(q.trim()); setSel(null); setOpen(true); setQ(''); setSubject('all'); reveal.current = true; }}>
                    See where the Praxis uses it
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {/* a word with no entry: what the corpus says about it */}
        {phrase && said && (!narrow || reading) && (
          <article ref={detailRef} className="gl-detail gl-noentry" aria-labelledby="gl-term">
            {reading && (
              <button type="button" className="gl-back" onClick={back}>
                <svg viewBox="0 0 24 24" aria-hidden><path d="m14.5 6-6 6 6 6" /></svg>All terms
              </button>
            )}
            <div className="gl-in" key={phrase}>
              <p className="gl-where"><span className="gl-where-domain">No entry of its own</span></p>
              <h2 id="gl-term" className="gl-term">{said.phrase}</h2>
              <p className="gl-long">
                {said.covered.length || said.uses.length
                  ? 'The glossary has no entry for this phrase. This is what the Praxis says about it.'
                  : said.closest.length
                    ? 'The glossary has no entry for this phrase, and no Step or guide uses it in these words. These entries have the nearest names.'
                    : 'The glossary has no entry for this phrase, and no Step or guide uses it in these words.'}
              </p>
              {said.covered.length > 0 && (
                <div className="gl-sec" data-said="covered">
                  <span className="label">Explained under</span>
                  <ul className="gl-says">
                    {(more.covered ? said.covered : said.covered.slice(0, 4)).map(c => (
                      <li key={c.term.id}>
                        <button type="button" onClick={() => pick(c.term.id)}>
                          <strong>{c.term.term}</strong>
                          <q><Marked text={c.passage} phrase={said.phrase} /></q>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {said.covered.length > 4 && !more.covered && <button type="button" className="btn btn-ghost btn-sm gl-more" onClick={() => setMore(m => ({ ...m, covered: true }))}>Show the other {said.covered.length - 4}</button>}
                </div>
              )}
              {said.uses.length > 0 && (
                <div className="gl-sec" data-said="uses">
                  <span className="label">Used in</span>
                  <ul className="gl-says">
                    {(more.uses ? said.uses : said.uses.slice(0, 4)).map(u => (
                      <li key={u.kind + u.id}>
                        <button type="button" onClick={() => go(u)}>
                          <strong>{u.title}</strong>
                          <em>{gate(u) + u.where}</em>
                          <q><Marked text={u.passage} phrase={said.phrase} /></q>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {said.uses.length > 4 && !more.uses && <button type="button" className="btn btn-ghost btn-sm gl-more" onClick={() => setMore(m => ({ ...m, uses: true }))}>Show the other {said.uses.length - 4}</button>}
                </div>
              )}
              {said.closest.length > 0 && (
                <div className="gl-sec" data-said="closest">
                  <span className="label">Nearest names</span>
                  <div className="gl-chips">
                    {said.closest.map(t => <button key={t.id} type="button" className="gl-chip" onClick={() => pick(t.id)}>{t.term}</button>)}
                  </div>
                </div>
              )}
              {!narrow && <div className="gl-actions"><button type="button" className="btn btn-sm" onClick={() => setPhrase(null)}>Back to the terms</button></div>}
            </div>
          </article>
        )}

        {current && (!narrow || reading) && (
          <article ref={detailRef} className="gl-detail" aria-labelledby="gl-term" style={where ? { ['--hue' as string]: subjectById(where).hue } : undefined}>
            {reading && (
              <button type="button" className="gl-back" onClick={back}>
                <svg viewBox="0 0 24 24" aria-hidden><path d="m14.5 6-6 6 6 6" /></svg>All terms
              </button>
            )}
            <div className="gl-in" key={current.id}>
              <p className="gl-where">
                {where && <SubjectGlyph id={where} size={18} />}
                {where && <span className="gl-where-subject">{subjectById(where).name}</span>}
                {/* a domain the subject's own name already says (Identity, under Identity and access) is not repeated */}
                {!(where && subjectById(where).name.toLowerCase().startsWith(current.domain.toLowerCase())) && <span className="gl-where-domain">{current.domain}</span>}
              </p>
              <h2 id="gl-term" className="gl-term">{current.term}</h2>
              {aka.length > 0 && <p className="gl-aka">Also called {aka.join(', ')}</p>}
              <p className="gl-short">{current.short}</p>
              <p className="gl-long">{current.long}</p>
              {current.why && (
                <div className="gl-why">
                  <span className="label">Why it matters</span>
                  <p>{current.why}</p>
                </div>
              )}
              {current.sources && current.sources.length > 0 && (
                <div className="gl-sec gl-sources">
                  <span className="label">Read at the source</span>
                  <ul>
                    {current.sources.map(s => (
                      <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a><span>read {s.checked}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              {related.length > 0 && (
                <div className="gl-sec" data-related>
                  <span className="label">Related terms</span>
                  <TermWeb hue={subjectById(where || 'systems').hue} terms={related} onPick={id => pick(id)} />
                </div>
              )}
              {places && placeList('taught', 'Taught in ' + (places.taught.length === 1 ? 'one Step' : places.taught.length + ' Steps'), places.taught)}
              {places && placeList('used', (places.taught.length ? 'Also used in ' : 'Used in ') + (places.used.length + places.guides.length === 1 ? 'one place' : places.used.length + places.guides.length + ' places'), [...places.used, ...places.guides])}
              <div className="gl-actions">
                <button type="button" className="btn btn-sm btn-key" onClick={() => d({ t: 'route', view: 'study', id: 'term:' + current.id })}>Study its card</button>
                {at >= 0 && (
                  <span className="gl-step">
                    <button type="button" className="btn btn-sm" disabled={at <= 0} onClick={() => at > 0 && pick(shown[at - 1].id)}
                      aria-label={at > 0 ? 'Previous term: ' + shown[at - 1].term : 'Previous term'}>
                      <svg viewBox="0 0 24 24" aria-hidden><path d="m14.5 6-6 6 6 6" /></svg><span className="gl-word">Previous</span>
                    </button>
                    <button type="button" className="btn btn-sm" disabled={at >= shown.length - 1} onClick={() => at < shown.length - 1 && pick(shown[at + 1].id)}
                      aria-label={at < shown.length - 1 ? 'Next term: ' + shown[at + 1].term : 'Next term'}>
                      <span className="gl-word">Next</span><svg viewBox="0 0 24 24" aria-hidden><path d="m9.5 6 6 6-6 6" /></svg>
                    </button>
                  </span>
                )}
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
