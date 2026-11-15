/* STEPS — the record. SmallSteps, StrongSteps, SAFESteps.
   Statement: reputation is a ledger of decisions, not a feeling.

   The catalogue is large by design — every Step in the curriculum pays out — so
   the job here is navigation, not display. Tier, then domain, then search, and
   the list renders in pages so a browser is never asked to lay out six hundred
   cards at once. */

import React, { useEffect, useMemo, useState } from 'react';
import { AWARDS } from '../content/registry';
import type { AwardTier } from '../content/schema';
import { useS, rankOf } from '../lib/state';
import { AwardCard, SectionHead, TIER_NAMES, PhoneSelect } from '../components/bits';
import { TierMark } from '../components/Glyphs';
import { chargeKeystone } from '../lib/swarm';
import { ServiceRecord } from '../components/ServiceRecord';

const TIER_LEDE: Record<AwardTier, string> = {
  small:
    'The honest beginnings. First acts, consistency, curiosity, the noticing. Nobody skips these — every strong record starts small.',
  strong:
    'Demonstrated capability. Pages sealed, drills won cleanly, rooms commanded, projects shipped with evidence. These are what your Praxis Profile is made of.',
  safe:
    'The rarest tier. Judgment calls that define a security leader: the harder correct answer, the refused bad tradeoff, the commons defended, the thing designed to fail safely.',
};

const PAGE = 48;

export function StepsView() {
  const { s, d } = useS();
  const [tier, setTier] = useState<AwardTier>('small');
  const [domain, setDomain] = useState('all');
  const [q, setQ] = useState('');
  const [onlyEarned, setOnlyEarned] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => { chargeKeystone(); }, [tier]);
  useEffect(() => { setLimit(PAGE); }, [tier, domain, q, onlyEarned]);

  const counts = useMemo(() => {
    const c: Record<AwardTier, { earned: number; total: number }> = {
      small: { earned: 0, total: 0 },
      strong: { earned: 0, total: 0 },
      safe: { earned: 0, total: 0 },
    };
    for (const a of AWARDS) {
      c[a.tier].total++;
      if (s.awards[a.id]) c[a.tier].earned++;
    }
    return c;
  }, [s.awards]);

  const domains = useMemo(() => {
    const set = new Set<string>();
    for (const a of AWARDS) if (a.tier === tier) set.add(a.domain);
    return ['all', ...[...set].sort()];
  }, [tier]);

  const ql = q.trim().toLowerCase();
  const shown = useMemo(() => {
    const list = AWARDS.filter(a =>
      a.tier === tier &&
      (domain === 'all' || a.domain === domain) &&
      (!onlyEarned || s.awards[a.id]) &&
      (!ql || (a.name + ' ' + a.statement + ' ' + a.criteria).toLowerCase().includes(ql))
    );
    /* earned first — the record you have outranks the record you could have */
    return list.sort((a, b) => (s.awards[b.id] ? 1 : 0) - (s.awards[a.id] ? 1 : 0));
  }, [tier, domain, onlyEarned, ql, s.awards]);

  const rank = rankOf(s.respect);
  const totalEarned = Object.keys(s.awards).length;

  return (
    <div className="wrap-wide">
      <SectionHead sigil="stairs"
        kicker={'YOUR RECORD · RANK ' + rank.name.toUpperCase() + ' · STREAK ' + s.streak}
        title="Steps."
        lede="Your progress, awards, honours, and track record — the whole praxis of milestones. Every entry is earned; none are given."
      />

      <div className="row" style={{ gap: 10, marginBottom: 'var(--s5)', flexWrap: 'wrap' }}>
        <span className="chip sig">{totalEarned} earned</span>
        <span className="chip">{AWARDS.length} in the catalogue</span>
        <span className="chip gold">{s.respect.toLocaleString()} respect</span>
        <span className="chip gold">{s.trust.toLocaleString()} trust</span>
      </div>

      <ServiceRecord strip />

      <div className="row" style={{ marginBottom: 'var(--s4)', flexWrap: 'wrap' }}
        data-keystone data-essence="#a78bff">
        {(['small', 'strong', 'safe'] as AwardTier[]).map(t => (
          <button
            key={t}
            className={'btn' + (tier === t ? ' btn-charge' : '')}
            aria-pressed={tier === t}
            onClick={() => { setTier(t); setDomain('all'); }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <TierMark tier={t} size={17} />
              {TIER_NAMES[t]}s
              <span className="chip">{counts[t].earned}/{counts[t].total}</span>
            </span>
          </button>
        ))}
        <span className="spacer" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search this tier…"
          aria-label="Search awards"
          style={{
            flex: '1 1 200px', maxWidth: 300, padding: '11px 15px', borderRadius: 12,
            border: '1px solid var(--frame-strong)', background: 'var(--panel-2)',
            color: 'var(--ink)', fontSize: '0.98rem', boxShadow: 'var(--inset)',
          }}
        />
        <button className={'btn btn-sm btn-ghost' + (onlyEarned ? ' btn-charge' : '')}
          aria-pressed={onlyEarned} onClick={() => setOnlyEarned(v => !v)}>
          Earned only
        </button>
      </div>

      {domains.length > 2 && <PhoneSelect label="Domain" value={domain} options={domains.map(dm => ({ value: dm, label: dm === 'all' ? 'Every domain' : dm }))} onChange={setDomain} />}
      {domains.length > 2 && (
        <div className="chiprow row-scroll" style={{ marginBottom: 'var(--s4)' }}>
          {domains.map(dm => (
            <button key={dm} className={'chip' + (domain === dm ? ' on' : '')}
              style={{ cursor: 'pointer' }} aria-pressed={domain === dm}
              onClick={() => setDomain(dm)}>
              {dm}
            </button>
          ))}
        </div>
      )}

      <p className="lede" style={{ marginBottom: 'var(--s5)' }}>{TIER_LEDE[tier]}</p>

      <div className="grid grid-auto-lg">
        {shown.slice(0, limit).map(a => (
          <AwardCard key={a.id} a={a} earnedAt={s.awards[a.id]} />
        ))}
      </div>

      {shown.length > limit && (
        <div className="center" style={{ marginTop: 'var(--s5)' }}>
          <button className="btn" onClick={() => setLimit(n => n + PAGE)}>
            Show more — {shown.length - limit} remaining in this view
          </button>
        </div>
      )}

      {shown.length === 0 && (
        <div className="empty">
          {onlyEarned || ql || domain !== 'all'
            ? 'Nothing matches this filter yet.'
            : 'Nothing earned in this tier yet. The Practice and the Chapters are where these come from.'}
          <div style={{ marginTop: 14 }}>
            <button className="btn btn-sm" onClick={() => d({ t: 'route', view: 'chapters' })}>
              Open the Chapters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
