/* One Modux stack: the models in adoption order, why they compound, and
   where the stack fits. */

import React, { useEffect } from 'react';
import { moduxStackById, moduxById, ESSENCE_HEX } from '../content/registry';
import { FAMILY_LABEL, FAMILY_HUE, TIER_LABEL } from '../content/modux-schema';
import { useS } from '../lib/state';
import { studyRoute } from '../lib/study/session';
import { chargeKeystone } from '../lib/swarm';
import { RiseHead } from '../components/RiseHead';

export function ModuxStackView() {
  const { s, d } = useS();
  const st = moduxStackById(s.route.id || '');
  useEffect(() => { chargeKeystone(); window.scrollTo({ top: 0 }); }, [s.route.id]);
  if (!st) return <div className="wrap mx"><div className="mx-empty">That stack does not exist.</div></div>;
  const hue = ESSENCE_HEX[st.essence];

  return (
    <div className="wrap mx">
      <button className="btn btn-ghost btn-sm" onClick={() => d({ t: 'route', view: 'modux', sub: 'stacks' })}>← Stacks</button>

      <section className="mx-hero mx-glass mx-lit" style={{ ['--hue' as string]: hue }} data-keystone data-essence={hue}>
        <div className="mx-hero-text">
          <span className="mx-kicker">Stack · {st.models.length} models</span>
          <RiseHead text={st.name} />
          <p className="lede">{st.statement}</p>
          <div className="chiprow" style={{ marginTop: 12 }}>
            <button className="btn btn-sm btn-ghost" onClick={() => studyRoute(d, ['stack:' + st.id, ...st.models.map(id => 'model:' + id)], st.name, s.unitiaC)}>Study this stack in StudyMode</button>
          </div>
        </div>
      </section>

      <section className="mx-section">
        <h2>Why They Compound</h2>
        <p className="sec big-sec">{st.why}</p>
      </section>

      <section className="mx-section">
        <h2>In Adoption Order</h2>
        <ol className="mx-order">
          {st.models.map((id, i) => {
            const m = moduxById(id);
            return (
              <li key={id}>
                <button className="mx-order-row" disabled={!m}
                  style={{ ['--hue' as string]: m ? ESSENCE_HEX[FAMILY_HUE[m.family]] : hue }}
                  onClick={() => m && d({ t: 'route', view: 'modux-model', id })}>
                  <span className="mx-order-n">{i + 1}</span>
                  <span className="mx-order-body">
                    <span className="mx-order-name">{m ? m.name : id}</span>
                    <span className="mx-order-meta">{m ? FAMILY_LABEL[m.family] + ' · ' + TIER_LABEL[m.tier] : 'still being written'}</span>
                    {m && <span className="mx-order-stmt">{m.statement}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mx-two-even">
        <div className="mx-glass mx-side-card">
          <span className="mx-kicker">Fits</span>
          <p className="sec">{st.fits}</p>
        </div>
        <div className="mx-glass mx-side-card">
          <span className="mx-kicker">Seen working</span>
          <p className="sec">{st.evidence}</p>
        </div>
      </div>
    </div>
  );
}
