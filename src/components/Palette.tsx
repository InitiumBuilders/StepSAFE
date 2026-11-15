/* THE PALETTE: find anything in the Praxis in a keystroke. Ctrl or Cmd K,
   or the slash key outside a field, opens it. It searches every card in the
   deck (terms, structures, threats, stacks, guides, Steps, rooms, the public
   incidents) and the moves: every page of the app, the three skins, the text
   size. Enter opens the source page; the card button opens it in StudyMode.
   The deck loads the first time the palette opens, so the shell stays light. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useS, type Act } from '../lib/state';
import type { ViewKey } from '../lib/state';

interface Entry { id: string; title: string; kind: string; detail: string; go: Act; card?: string; hue?: string; /** a term's other names */ aka?: string[] }

const PAGES: { key: ViewKey; label: string; detail: string }[] = [
  { key: 'home', label: 'Ground', detail: 'The watch, the focus, the record' },
  { key: 'chapters', label: 'Chapters', detail: 'Twelve chapters, one doctrine' },
  { key: 'practice', label: 'The Practice', detail: 'The simulation rooms' },
  { key: 'modux', label: 'Modux Models', detail: 'The structures that hold, and the gauges' },
  { key: 'guides', label: 'StepGuides', detail: 'Guides and the glossary' },
  { key: 'study', label: 'StudyMode', detail: 'Every concept, one deck' },
  { key: 'steps', label: 'Steps', detail: 'Awards and the path' },
  { key: 'unit', label: 'Your unit', detail: 'The members who have arrived' },
  { key: 'profile', label: 'Praxis Profile', detail: 'Your record, your goals' },
  { key: 'next', label: 'NextSteps', detail: 'What to do next' },
  { key: 'seva', label: 'Seva and Claros', detail: 'The two minds: one teaches, one reads systems' },
  { key: 'settings', label: 'Settings', detail: 'Light, display, the voice, your device' },
];

function moves(): Entry[] {
  const out: Entry[] = PAGES.map(p => ({ id: 'page:' + p.key, title: p.label, kind: 'Page', detail: p.detail, go: { t: 'route', view: p.key } }));
  out.push(
    { id: 'move:test', title: 'Take a test', kind: 'Page', detail: 'Twenty questions in StudyMode, no hints until the end', go: { t: 'route', view: 'study', sub: 'test' } },
    { id: 'move:welcome', title: 'The welcome page', kind: 'Page', detail: 'The whole Praxis on one page, and what Claros and StudyMode can do', go: { t: 'route', view: 'welcome' } },
    { id: 'move:checks', title: 'Checks before launch', kind: 'Page', detail: 'Dash Defenders: the checks a project runs before a launch, each with a record for a reviewer', go: { t: 'route', view: 'check' } },
    { id: 'move:check', title: 'The ten-minute treasury check', kind: 'Page', detail: 'Dash Defenders: signers, multisig and recovery, with a record for a reviewer', go: { t: 'route', view: 'check', id: 'treasury' } },
    { id: 'move:check-accounts', title: 'The accounts and access check', kind: 'Page', detail: 'Dash Defenders: the domain, sign-in, and getting back in, with a record for a reviewer', go: { t: 'route', view: 'check', id: 'accounts' } },
    { id: 'move:check-code', title: 'The code and releases check', kind: 'Page', detail: 'Dash Defenders: changing the code, releases, and dependencies, read where it can be from OpenSSF Scorecard', go: { t: 'route', view: 'check', id: 'code' } },
    { id: 'move:check-people', title: 'The people and devices check', kind: 'Page', detail: 'Dash Defenders: the team, its devices, and what it does under pressure', go: { t: 'route', view: 'check', id: 'people' } },
    { id: 'move:check-incident', title: 'The worst day check', kind: 'Page', detail: 'Dash Defenders: what is ready before an incident, the first hours, and coming back', go: { t: 'route', view: 'check', id: 'incident' } },
    { id: 'move:read', title: 'Read a token', kind: 'Page', detail: 'Dash Defenders: who can mint, freeze, pause or destroy a Dash Platform token, read from its public record', go: { t: 'route', view: 'read' } },
    { id: 'move:systems', title: 'Known systems', kind: 'Page', detail: 'Real organisations, mapped and ready to run as a stress day', go: { t: 'route', view: 'modux', sub: 'systems' } },
    { id: 'theme:nocturne', title: 'Nocturne', kind: 'Light', detail: 'The night sea', go: { t: 'theme', theme: 'nocturne' } },
    { id: 'theme:meridian', title: 'Meridian', kind: 'Light', detail: 'The daylight', go: { t: 'theme', theme: 'meridian' } },
    { id: 'theme:mov', title: 'Semble-Super-Dark-Mov', kind: 'Light', detail: 'The black, built for the sharpest contrast', go: { t: 'theme', theme: 'mov' } },
    { id: 'text:standard', title: 'Text size: standard', kind: 'Display', detail: 'The size everything starts at', go: { t: 'display', textSize: 'standard' } },
    { id: 'text:large', title: 'Text size: large', kind: 'Display', detail: 'Everything a little larger', go: { t: 'display', textSize: 'large' } },
    { id: 'text:largest', title: 'Text size: largest', kind: 'Display', detail: 'Everything larger still', go: { t: 'display', textSize: 'largest' } },
    { id: 'motion:full', title: 'Motion: full', kind: 'Display', detail: 'The field, the reveals, the glow', go: { t: 'display', motion: 'full' } },
    { id: 'motion:calm', title: 'Motion: calm', kind: 'Display', detail: 'Everything still', go: { t: 'display', motion: 'calm' } },
  );
  return out;
}

const KIND_WORD: Record<string, string> = { term: 'Term', model: 'Structure', guide: 'Guide', step: 'Step', threat: 'Threat', stack: 'Stack', room: 'Room', incident: 'In the world' };

/** the other name a search matched, when the entry's own name did not: shown so the result explains itself */
const viaName = (e: Entry, q: string) => (q && e.aka && !e.title.toLowerCase().includes(q) ? e.aka.find(n => n.toLowerCase().includes(q)) : undefined);

function score(e: Entry, q: string, tokens: string[]): number {
  const t = e.title.toLowerCase(), d = e.detail.toLowerCase(), k = e.kind.toLowerCase();
  const aka = (e.aka || []).map(n => n.toLowerCase());
  if (!tokens.every(x => t.includes(x) || d.includes(x) || k.includes(x) || aka.some(n => n.includes(x)))) return 0;
  let s = 1;
  if (t === q) s += 100;
  else if (t.startsWith(q)) s += 60;
  else if (t.includes(q)) s += 30;
  /* another name for the entry counts a little under its own name */
  else if (aka.some(n => n === q)) s += 90;
  else if (aka.some(n => n.startsWith(q))) s += 50;
  else if (aka.some(n => n.includes(q))) s += 25;
  if (tokens.every(x => t.includes(x))) s += 10;
  if (e.kind === 'Page' || e.kind === 'Light' || e.kind === 'Display') s += 4;
  return s;
}

export function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { d } = useS();
  const [q, setQ] = useState('');
  const [at, setAt] = useState(0);
  const [cards, setCards] = useState<Entry[] | null>(null);
  const input = useRef<HTMLInputElement | null>(null);

  /* the deck loads once, the first time the palette opens */
  useEffect(() => {
    if (!open || cards) return;
    let alive = true;
    Promise.all([import('../lib/study/cards'), import('../content/outlier/systems'), import('../content/registry').then(r => r.loadContent())]).then(([m, k]) => {
      if (!alive) return;
      /* the known systems: each opens on the Modux page, mapped and ready to run */
      const systems: Entry[] = k.KNOWN_SYSTEMS.map(x => ({ id: 'sys:' + x.id, title: x.name, kind: 'System', detail: x.keystoneQuestion, go: { t: 'route', view: 'modux', sub: 'systems', id: 'sys:' + x.id } as Act, hue: '#a78bff' }));
      setCards([...systems, ...m.deck().map(c => ({ id: c.id, title: c.title, kind: KIND_WORD[c.kind] || c.kind, detail: c.domain, go: { t: 'route', ...c.route } as Act, card: c.id, hue: m.KIND_HUE[c.kind], aka: c.aka }))]);
    }).catch(() => { if (alive) setCards([]); });
    return () => { alive = false; };
  }, [open, cards]);

  useEffect(() => { if (open) { setQ(''); setAt(0); window.setTimeout(() => input.current?.focus(), 30); } }, [open]);

  const all = useMemo(() => [...moves(), ...(cards || [])], [cards]);
  /* the foot counts the deck's cards, the same number StudyMode gives; the known systems are found here too but are not cards */
  const cardCount = useMemo(() => (cards || []).filter(c => c.card).length, [cards]);
  const results = useMemo(() => {
    const ql = q.trim().toLowerCase();
    if (!ql) return all.filter(e => e.kind === 'Page').slice(0, 8);
    const tokens = ql.split(/\s+/).filter(Boolean);
    return all.map(e => ({ e, s: score(e, ql, tokens) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s || a.e.title.length - b.e.title.length).slice(0, 12).map(x => x.e);
  }, [q, all]);

  useEffect(() => { setAt(0); }, [q]);

  const go = (e: Entry, asCard = false) => {
    if (asCard && e.card) d({ t: 'route', view: 'study', id: e.card });
    else d(e.go);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="scrim pal-scrim" onClick={onClose} role="presentation">
      <div className="pal" role="dialog" aria-label="Find anything in the Praxis" onClick={e => e.stopPropagation()}>
        <div className="pal-head">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          <input ref={input} value={q} onChange={e => setQ(e.target.value)} placeholder={cards ? 'A term, a structure, a Step, a page, a skin' : 'Loading the deck'} aria-label="Find anything in the Praxis" autoComplete="off" spellCheck={false}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setAt(a => Math.min(results.length - 1, a + 1)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setAt(a => Math.max(0, a - 1)); }
              else if (e.key === 'Enter' && results[at]) { e.preventDefault(); go(results[at], e.shiftKey); }
              else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
            }} />
          {/* a real button: on a phone the palette fills the screen, so this is the way out */}
          <button type="button" className="pal-close" onClick={onClose} aria-label="Close"><kbd>Esc</kbd><span>Close</span></button>
        </div>
        <ul className="pal-list" role="listbox" aria-label="Results">
          {results.map((e, i) => (
            <li key={e.id} role="option" aria-selected={i === at} className={'pal-row' + (i === at ? ' on' : '')} style={{ ['--hue' as string]: e.hue || 'var(--cyan)' }} onMouseEnter={() => setAt(i)}>
              <button className="pal-main" onClick={() => go(e)}>
                <span className="pal-kind">{e.kind}</span>
                <span className="pal-text"><strong>{e.title}</strong><em>{(() => { const via = viaName(e, q.trim().toLowerCase()); return via ? 'Also called ' + via : e.detail; })()}</em></span>
              </button>
              {e.card && <button className="pal-card" onClick={() => go(e, true)} title="Open it as a card in StudyMode">Card</button>}
            </li>
          ))}
          {q.trim() && !results.length && <li className="pal-empty">{cards ? 'Nothing by that name. Try one word of it.' : 'Loading the deck'}</li>}
        </ul>
        <div className="pal-foot"><span className="pal-hint"><kbd>{'↑'}</kbd><kbd>{'↓'}</kbd> move</span><span className="pal-hint"><kbd>Enter</kbd> open</span><span className="pal-hint"><kbd>Shift</kbd><kbd>Enter</kbd> as a card</span><span>{cards ? cardCount.toLocaleString() + ' cards' : ''}</span></div>
      </div>
    </div>
  );
}

/* the shortcuts, on the question mark */
export function Shortcuts({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const rows: [string, string][] = [
    ['Ctrl K or Cmd K, or /', 'Find anything'],
    ['?', 'These shortcuts'],
    ['Space', 'Turn the card'],
    ['1 2 3 4', 'Again, Hard, Good, Strong'],
    ['← →', 'The card before, the next card'],
    ['L', 'Listen to the card'],
    ['Esc', 'Close'],
  ];
  return (
    <div className="scrim pal-scrim" onClick={onClose} role="presentation">
      <div className="pal pal-keys" role="dialog" aria-label="Keyboard shortcuts" onClick={e => e.stopPropagation()}>
        <div className="pal-head"><strong>Keys</strong><button type="button" className="pal-close" onClick={onClose} aria-label="Close"><kbd>Esc</kbd><span>Close</span></button></div>
        <ul className="pal-list">{rows.map(([k, w]) => <li key={k} className="pal-row static"><span className="pal-keycap">{k}</span><span className="pal-text"><strong>{w}</strong></span></li>)}</ul>
        <div className="pal-foot"><span>There are eight more things hidden in the Praxis. One word opens them.</span></div>
      </div>
    </div>
  );
}
