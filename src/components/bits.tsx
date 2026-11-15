/* Small shared pieces: toasts, vessel, seals, award cards, section heads. */

import React, { createContext, useCallback, useContext, useState } from 'react';
import { linkTo, type Route } from '../lib/history';
import type { Award } from '../content/schema';
import { PageSigil, type SigilKind } from './PageSigil';
import { RiseHead } from './RiseHead';

/* ---------- toasts ---------- */

interface Toast { id: number; title: string; body?: string; gold?: boolean }
const ToastCtx = createContext<{ push: (t: Omit<Toast, 'id'>) => void }>({ push: () => {} });
let toastSeq = 1;

export function ToastHost({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = toastSeq++;
    setList(l => [...l.slice(-3), { ...t, id }]);
    setTimeout(() => setList(l => l.filter(x => x.id !== id)), 5600);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="toasts" aria-live="polite">
        {list.map(t => (
          <div key={t.id} className={'toast' + (t.gold ? ' gold' : '')}
            onClick={() => setList(l => l.filter(x => x.id !== t.id))}>
            <strong style={{ display: 'block', marginBottom: t.body ? 6 : 0 }}>{t.title}</strong>
            {t.body && <span className="sec">{t.body}</span>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToast() {
  return useContext(ToastCtx);
}

/* ---------- progress vessel (stock made literal) ---------- */

export function Vessel({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      {label && (
        <div className="row-between" style={{ marginBottom: 6 }}>
          <span className="label">{label}</span>
          <span className="label">{pct}%</span>
        </div>
      )}
      <div
        className="vessel"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'progress'}
      >
        <div className="vessel-fill" style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}

/* ---------- award card ---------- */

export const TIER_NAMES: Record<Award['tier'], string> = {
  small: 'SmallStep',
  strong: 'StrongStep',
  safe: 'SAFEStep',
};

export function AwardCard({ a, earnedAt }: { a: Award; earnedAt?: number }) {
  return (
    <div className={'award t-' + a.tier + (earnedAt ? '' : ' locked')}>
      <div className="glyph" aria-hidden>
        {a.glyph}
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="row" style={{ gap: 8, marginBottom: 2 }}>
          <span className={'chip ' + (a.tier === 'safe' ? 'gold' : a.tier === 'strong' ? 'sig' : 'on')}>
            {TIER_NAMES[a.tier]}
          </span>
          <span className="chip">{a.domain}</span>
          {a.rarity !== 'common' && <span className="chip">{a.rarity}</span>}
        </div>
        <div className="an">{a.name}</div>
        <p className="sec" style={{ margin: '0 0 8px' }}>
          {earnedAt ? a.statement : a.criteria}
        </p>
        <details className="reveal">
          <summary>Why this matters</summary>
          <div className="reveal-body">
            <p className="sec" style={{ margin: 0 }}>{a.research}</p>
            {earnedAt && (
              <p className="label" style={{ marginTop: 10, marginBottom: 0 }}>
                Earned {new Date(earnedAt).toLocaleDateString()} · +{a.respect} respect · +{a.trust} trust
              </p>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}

/* ---------- section head ---------- */

export function SectionHead({
  kicker,
  title,
  lede,
  sigil,
}: {
  kicker: string;
  title: string;
  lede?: string;
  /** the page's own drawn figure, beside its heading */
  sigil?: SigilKind;
}) {
  return (
    <div className={'view-head' + (sigil ? ' has-sigil' : '')}>
      {sigil && <PageSigil kind={sigil} />}
      <div className="view-head-text">
        <div className="label" style={{ marginBottom: 12 }}>
          {kicker}
        </div>
        <RiseHead text={title} />
        {lede && <p className="lede">{lede}</p>}
      </div>
    </div>
  );
}

/* ---------- the StepSAFE glyph ---------- */

export function Mark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="none" stroke="var(--frame-strong)" />
      <path
        d="M7 22h6.5v-6h6v-6H26"
        stroke="var(--cyan)"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* A long row of chips for one choice asks a phone to scroll sideways for screens (the Steps page ran to twelve).
   On a phone the same choice is one native picker; the chips stay for wider screens. It stands directly before
   the row it replaces (styles/reflow.css hides that row at phone width). */
export function PhoneSelect<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <label className="phone-select">
      <span className="label">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value as T)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

/* A place's own link, to send to someone. The share sheet is a touch screen's; with a mouse the link is copied and
   the button says so. */
export function ShareLink({ route, title, label, className, text }: { route: Route; title: string; label: string; className?: string; /** a line to send with the link */ text?: string }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = linkTo(route);
    try {
      if (window.matchMedia('(pointer: coarse)').matches && typeof navigator.share === 'function') {
        await navigator.share(text ? { title, text, url } : { title, url });
        return;
      }
      await navigator.clipboard.writeText(text ? text + ' ' + url : url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch { /* the sheet was closed, or the clipboard is not allowed here */ }
  }
  return (
    <button type="button" className={'btn btn-ghost btn-sm share-link' + (className ? ' ' + className : '')} onClick={share}>
      {copied ? 'Link copied' : label}
    </button>
  );
}
