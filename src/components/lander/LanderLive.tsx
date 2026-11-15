/* The welcome page's live parts, loaded only when a visitor gets near them: the model reads the demo
   system (a civic platform like Semble.CC), plays its hardest day bare and then with the plan, and
   Claros answers one question about it, written out as it would be in the conversation. Everything
   shown is computed here, on the visitor's device. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MODUX_MODELS } from '../../content/registry';
import { buildOwnGauge } from '../../content/modux/own';
import { DEMO_SPEC, DEMO_NAME } from '../../content/pitch-demo';
import { readFocus, clarosAnswer, type ClarosRead } from '../../lib/claros';
import { leverage } from '../../content/modux/dynamics';
import { verbOf, type Lesson } from '../../lib/hardening';
import { buildState, runState } from '../../lib/systemStates';
import { ClarosDay } from '../ClarosDay';

let cached: { read: ClarosRead; byId: Map<string, (typeof MODUX_MODELS)[number]> } | null = null;
function demo() {
  if (cached) return cached;
  const byId = new Map(MODUX_MODELS.map(m => [m.id, m]));
  const gauge = buildOwnGauge(DEMO_SPEC, byId);
  if (!gauge) return null;
  cached = { read: readFocus({ key: 'demo:civic', name: DEMO_NAME, kind: 'own', gauge }, byId), byId };
  return cached;
}

const VERB_RE = /\((Model|Harden|Detect|Isolate|Restore)\)/;

/** Claros's answer, as the conversation draws it: paragraphs, and the moves as a numbered list in their verbs' colours */
function Answer({ text, shown }: { text: string; shown: number }) {
  const visible = text.slice(0, shown);
  return (
    <>
      {visible.split(/\n{2,}/).map((b, i) => {
        const lines = b.split('\n');
        const numbered = lines.slice(1).length > 0 && lines.slice(1).every(l => /^\d+\.\s?/.test(l));
        if (!numbered) return <p key={i}>{b}</p>;
        return (
          <div key={i}>
            <p>{lines[0]}</p>
            <ol className="minds-ol">
              {lines.slice(1).map((l, j) => { const v = l.match(VERB_RE)?.[1]; return <li key={j} className={v ? 'v-' + v.toLowerCase() : undefined}>{l.replace(/^\d+\.\s?/, '')}</li>; })}
            </ol>
          </div>
        );
      })}
    </>
  );
}

function Talk({ read }: { read: ClarosRead }) {
  const ask = 'Where should I harden first?';
  const text = useMemo(() => clarosAnswer(ask, read), [read]);
  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [shown, setShown] = useState(still ? text.length : 0);
  const box = useRef<HTMLDivElement>(null);
  /* the answer writes itself out once, the first time it is on screen */
  useEffect(() => {
    if (still || !box.current) return;
    let raf = 0;
    const io = new IntersectionObserver(es => {
      if (!es.some(e => e.isIntersecting)) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => { const k = Math.max(0, Math.min(text.length, Math.floor((now - t0) / 9))); setShown(k); if (k < text.length) raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
      window.setTimeout(() => setShown(text.length), text.length * 9 + 600);
    }, { threshold: 0.4 });
    io.observe(box.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [text, still]);
  return (
    <div className="lx-talk minds m-claros" ref={box} aria-label={'Claros answers: ' + ask}>
      <div className="minds-msg me"><div className="minds-bubble"><p>{ask}</p></div></div>
      <div className="minds-msg mind">
        <div className="minds-bubble">
          <Answer text={text} shown={shown} />
          {shown >= text.length && <span className="minds-meta"><span className="minds-tag">From the model</span></span>}
        </div>
      </div>
    </div>
  );
}

const h1 = (x: number) => String(Math.round(x * 10) / 10);
const VERB_LABEL: Record<string, string> = { model: 'Model', harden: 'Harden', detect: 'Detect', isolate: 'Isolate', restore: 'Restore' };

/** Harden it yourself: the moves Claros chose and three strong ones elsewhere on the map, a budget equal to the
    cost of Claros's plan, and the hardest day played again with whatever is chosen */
function Bench({ d }: { d: NonNullable<ReturnType<typeof demo>> }) {
  const { read, byId } = d;
  const g = read.focus.gauge;
  const plan = read.hard.lessons;
  const budget = plan.reduce((n, l) => n + l.cost, 0);
  const cands = useMemo(() => {
    const out: Lesson[] = [...plan];
    const used = new Set(plan.map(l => l.where));
    for (const m of leverage(g, [], byId, [], new Set(), 24).moves) {
      if (out.length >= plan.length + 3) break;
      if (out.some(x => x.id === m.id) || used.has(m.where)) continue;
      used.add(m.where);
      out.push({ day: 0, id: m.id, name: m.name, where: m.where, verb: verbOf(m.kind, byId.get(m.id)?.family, m.id), gain: 0, cost: m.cost, kept: 0 });
    }
    return out;
  }, [g, byId, plan]);
  const [sel, setSel] = useState<string[]>(() => plan.map(l => l.id));
  const cost = sel.reduce((n, id) => n + (cands.find(c => c.id === id)?.cost || 0), 0);
  const kept = useMemo(() => runState(buildState('adversary', { gauge: g, byId, stack: sel, reading: read.R })).kept, [sel, g, byId, read.R]);
  const best = read.hard.hardest;
  const chosen = cands.filter(c => sel.includes(c.id));
  const custom = useMemo(() => ({ ...read, hard: { ...read.hard, from: [], lessons: chosen } }), [read, sel]); // eslint-disable-line react-hooks/exhaustive-deps
  const isPlan = sel.length === plan.length && plan.every(l => sel.includes(l.id));
  const toggle = (id: string) => setSel(x => (x.includes(id) ? x.filter(y => y !== id) : [...x, id]));
  const verdict = isPlan ? 'This is Claros’s plan.'
    : kept >= best - 0.05 ? 'You matched Claros’s plan.'
    : sel.length === 0 ? 'Nothing in place: the day the model plays bare.'
    : 'Claros’s plan keeps ' + h1(best) + ' with ' + budget + ' points.';
  return (
    <div className="lx-bench">
      <div className="lx-bench-day">
        <ClarosDay key={sel.join(',') || 'bare'} read={custom} plan="hardest" byId={byId} planLabel="With your moves" />
      </div>
      <div className="lx-bench-side">
        <span className="lx-mini">The keystone</span>
        <strong className="lx-bench-key">{read.R.keystone ? read.nameOf(read.R.keystone) : 'None found'}</strong>
        <span className="lx-mini">Harden it yourself: {budget} points</span>
        <div className="lx-bench-moves" role="group" aria-label="The moves to place">
          {cands.map(c => {
            const on = sel.includes(c.id);
            const over = !on && cost + c.cost > budget;
            return (
              <button key={c.id} type="button" className={'lx-move v-' + c.verb + (on ? ' on' : '')} aria-pressed={on} disabled={over} onClick={() => toggle(c.id)}>
                <i aria-hidden />
                <span className="lx-move-name">{c.name}</span>
                <span className="lx-move-meta">{VERB_LABEL[c.verb]} at {read.nameOf(c.where).replace(/^The /, 'the ')} · {c.cost} {c.cost === 1 ? 'point' : 'points'}</span>
              </button>
            );
          })}
        </div>
        <div className="lx-bench-score" aria-live="polite">
          <span><strong>{h1(kept)}</strong> of 24 hours kept on the hardest day</span>
          <span>{cost} of {budget} points used. {verdict}</span>
        </div>
        <div className="lx-bench-acts">
          <button type="button" className="lx-btn sm" onClick={() => setSel(plan.map(l => l.id))} disabled={isPlan}>Claros’s plan</button>
          <button type="button" className="lx-btn ghost sm" onClick={() => setSel([])} disabled={!sel.length}>Clear</button>
        </div>
      </div>
    </div>
  );
}

export default function LanderLive({ part }: { part: 'day' | 'talk' }) {
  const d = useMemo(() => { try { return demo(); } catch { return null; } }, []);
  if (!d) return <div className="lx-live-wait">The demo could not be read on this device.</div>;
  if (part === 'talk') return <Talk read={d.read} />;
  return <Bench d={d} />;
}
