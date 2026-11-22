/* THE MODEL TABLE. The 96 Modux models laid out as they are organised: twelve families as columns, eight models each,
   every model as its emoji (content/modux/emoji.ts).

   The statement: within a family, bedrock sits at the base and the frontier at the top, so each column shows how far
   its structures have been proven, and four marks under each name count the same thing. Choose a model and the ones it
   compounds with light up beside it, in the order its record names them; the ones it pulls against are marked; the
   panel above says what it is and why its emoji, and opens it.

   Pointing previews, a click or a tap chooses, and the choice stays until another is chosen or Escape lets it go.
   Arrows move through the table (left and right across families, up and down within one), Enter opens the model.
   Find takes a name, a family or an emoji. On a phone the families stack, four models across, and the panel stays
   at the top of the screen. Nothing moves on its own; with reduced motion nothing moves at all. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MODUX_MODELS, ESSENCE_HEX, onContentReady } from '../content/registry';
import { FAMILY_LABEL, FAMILY_HUE, TIER_LABEL, type ModuxFamily, type ModuxTier, type ModuxModel } from '../content/modux-schema';
import { MODEL_EMOJI, FAMILY_EMOJI, emojiOf, modelByEmoji } from '../content/modux/emoji';
import { useS } from '../lib/state';
import { Field } from '../lib/field';

const FAMILIES = Object.keys(FAMILY_LABEL) as ModuxFamily[];
/* top of a column to its base */
const TIER_RANK: Record<ModuxTier, number> = { frontier: 0, emerging: 1, proven: 2, bedrock: 3 };
/* how far a structure has been proven, counted in four marks */
const TIER_MARKS: Record<ModuxTier, number> = { frontier: 1, emerging: 2, proven: 3, bedrock: 4 };

const hueOf = (f: ModuxFamily) => ESSENCE_HEX[FAMILY_HUE[f]];

function Marks({ tier }: { tier: ModuxTier }) {
  const n = TIER_MARKS[tier];
  return <span className="mt-marks" aria-hidden>{[0, 1, 2, 3].map(i => <i key={i} className={i < n ? 'on' : ''} />)}</span>;
}

export function ModelTable() {
  const { d } = useS();
  /* the outline draws the table at once; the full records add each model's statement when they arrive */
  const [, setTick] = useState(0);
  useEffect(() => onContentReady(() => setTick(t => t + 1)), []);
  /* the field's drifting discs rest while the table is open: through its glass cells their rims read as marks */
  useEffect(() => { Field.holdAir(); return () => Field.releaseAir(); }, []);

  const columns = useMemo(() => FAMILIES.map(f => MODUX_MODELS.filter(m => m.family === f)
    .sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier] || a.name.localeCompare(b.name))), []);
  const byId = useMemo(() => new Map(MODUX_MODELS.map(m => [m.id, m])), []);
  /* two models compound when either names the other */
  const partners = useMemo(() => {
    const p = new Map<string, string[]>();
    const add = (a: string, b: string) => { const l = p.get(a) || []; if (!l.includes(b) && byId.has(b)) l.push(b); p.set(a, l); };
    for (const m of MODUX_MODELS) for (const l of m.combines) { add(m.id, l.model); add(l.model, m.id); }
    return p;
  }, [byId]);

  const [pick, setPick] = useState<string | null>(null);
  const [peek, setPeek] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const cells = useRef(new Map<string, HTMLButtonElement>());

  const focusId = peek || pick;
  const focus: ModuxModel | null = focusId ? byId.get(focusId) || null : null;
  const pairs = focus ? partners.get(focus.id) || [] : [];
  const pulls = focus ? (focus.conflicts || []).map(l => l.model).filter(id => byId.has(id)) : [];
  const pairAt = new Map(pairs.map((id, i) => [id, i]));
  const pullSet = new Set(pulls);

  const ql = q.trim().toLowerCase();
  const byEmoji = modelByEmoji(q);
  const hits = ql ? new Set(MODUX_MODELS.filter(m => byEmoji ? m.id === byEmoji
    : (m.name.toLowerCase().includes(ql) || FAMILY_LABEL[m.family].toLowerCase().includes(ql) || (m.statement || '').toLowerCase().includes(ql))).map(m => m.id)) : null;

  useEffect(() => {
    const off = (e: KeyboardEvent) => { if (e.key === 'Escape' && pick) { setPick(null); setPeek(null); } };
    window.addEventListener('keydown', off);
    return () => window.removeEventListener('keydown', off);
  }, [pick]);

  const open = (id: string) => d({ t: 'route', view: 'modux-model', id });
  function choose(id: string) { setPick(p => (p === id ? null : id)); setPeek(null); }
  function move(from: ModuxModel, key: string) {
    const c = FAMILIES.indexOf(from.family), r = columns[c].indexOf(from);
    let nc = c, nr = r;
    if (key === 'ArrowLeft') nc = (c + FAMILIES.length - 1) % FAMILIES.length;
    else if (key === 'ArrowRight') nc = (c + 1) % FAMILIES.length;
    else if (key === 'ArrowUp') nr = Math.max(0, r - 1);
    else if (key === 'ArrowDown') nr = Math.min(columns[nc].length - 1, r + 1);
    const next = columns[nc][Math.min(nr, columns[nc].length - 1)];
    if (next) { setPeek(next.id); cells.current.get(next.id)?.focus(); }
  }
  /* one cell takes the tab stop: the one in focus, else the first */
  const tabStop = focusId || columns[0][0]?.id;

  return (
    <section className={'mt' + (focus ? ' mt-focused' : '') + (hits ? ' mt-finding' : '')} aria-label="The model table">
      {/* find and the key to the marks, above the table */}
      <div className="mt-top">
        <label className="mt-find">
          <span className="mt-sr">Find a model by name, family or emoji</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Find by name or emoji"
            onKeyDown={e => {
              /* the key's own press would land on the cell that takes focus and click it off again, so it stops here */
              if (e.key === 'Enter' && hits && hits.size) { e.preventDefault(); const id = [...hits][0]; setPick(id); cells.current.get(id)?.focus(); }
            }} />
        </label>
        {hits && <span className="mt-find-n" role="status">{hits.size === 0 ? 'No model matches' : hits.size === 1 ? '1 model' : hits.size + ' models'}</span>}
        <span className="mt-legend" aria-hidden>
          <span><Marks tier="bedrock" /> Bedrock</span><span><Marks tier="proven" /> Proven</span>
          <span><Marks tier="emerging" /> Emerging</span><span><Marks tier="frontier" /> Frontier</span>
        </span>
      </div>

      {/* the model in focus, in one bar that stays in view while the table scrolls under it */}
      <div className="mt-bar" aria-live="polite" style={focus ? { ['--hue' as string]: hueOf(focus.family) } : undefined}>
        {focus ? (
          <>
            <span className="mt-bar-e mt-e" aria-hidden>{emojiOf(focus.id)}</span>
            <div className="mt-bar-text">
              <span className="mt-bar-meta"><span className="mt-e" aria-hidden>{FAMILY_EMOJI[focus.family].e}</span> {FAMILY_LABEL[focus.family]} · {TIER_LABEL[focus.tier]}</span>
              <strong className="mt-bar-name">{focus.name}</strong>
              <span className="mt-bar-why">{MODEL_EMOJI[focus.id]?.why}</span>
            </div>
            <span className="mt-bar-links">
              {pairs.length > 0 && <span className="mt-bar-pair">Compounds with {pairs.length}</span>}
              {pulls.length > 0 && <span className="mt-bar-pull">Pulls against {pulls.length}</span>}
            </span>
            <span className="mt-bar-act">
              <button type="button" className="btn btn-key" onClick={() => open(focus.id)}>Open</button>
              {pick === focus.id && <button type="button" className="btn btn-ghost" onClick={() => { setPick(null); setPeek(null); }}>Let go</button>}
            </span>
          </>
        ) : (
          <div className="mt-bar-text mt-bar-idle">
            <strong className="mt-bar-name">Every structure, one table</strong>
            <span className="mt-bar-why">Bedrock at the base of each family, the frontier at the top. Choose a model to light the ones it compounds with.</span>
          </div>
        )}
      </div>

      <div className="mt-grid" onPointerLeave={() => setPeek(null)}>
        {FAMILIES.map((f, c) => (
          <div key={f} className="mt-col" role="group" aria-label={FAMILY_LABEL[f]} style={{ ['--hue' as string]: hueOf(f) }}>
            <div className="mt-head" title={FAMILY_EMOJI[f].why}>
              <span className="mt-e mt-head-e" aria-hidden>{FAMILY_EMOJI[f].e}</span>
              <span className="mt-head-n">{FAMILY_LABEL[f]}</span>
            </div>
            {columns[c].map(m => {
              const on = focusId === m.id, pair = pairAt.has(m.id), pull = pullSet.has(m.id);
              const hit = hits ? hits.has(m.id) : false;
              return (
                <button key={m.id} ref={el => { if (el) cells.current.set(m.id, el); else cells.current.delete(m.id); }}
                  type="button" tabIndex={m.id === tabStop ? 0 : -1}
                  className={'mt-cell' + (on ? ' on' : '') + (pair ? ' pair' : '') + (pull ? ' pull' : '') + (hit ? ' hit' : '') + (pick === m.id ? ' picked' : '')}
                  style={pair ? { ['--k' as string]: pairAt.get(m.id) } : undefined}
                  aria-pressed={pick === m.id} aria-label={m.name + ', ' + TIER_LABEL[m.tier]}
                  onPointerEnter={e => { if (e.pointerType === 'mouse') setPeek(m.id); }}
                  onFocus={() => setPeek(m.id)}
                  onClick={() => choose(m.id)}
                  onDoubleClick={() => open(m.id)}
                  onKeyDown={e => {
                    if (e.key.startsWith('Arrow')) { e.preventDefault(); move(m, e.key); }
                    else if (e.key === 'Enter') { e.preventDefault(); open(m.id); }
                  }}>
                  <span className="mt-e mt-cell-e" aria-hidden>{emojiOf(m.id)}</span>
                  <span className="mt-cell-n" aria-hidden>{m.name}</span>
                  <Marks tier={m.tier} />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
