/* THE THRESHOLD. Where a visitor who chose to begin on the welcome page takes their handle and chooses their
   guide. It stays in the welcome page's world: the same night, the same system holding beside them, and
   August's "STEP. STRONG." over the two choices. The Praxis's own menu waits until they have begun.
   The handle and the guise are the only things asked; Enter begins once both are given. */

import React, { useEffect, useRef, useState } from 'react';
import type { Guise } from '../content/schema';
import { useS, uid } from '../lib/state';
import { useEngine } from '../lib/engine';
import { StageCanvas } from '../components/lander/StageCanvas';
import { Statement } from '../components/lander/Statement';
import '../styles/lander.css';
import '../styles/arrival.css';

const GUISES: { key: Guise; label: string }[] = [
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
  { key: 'one', label: 'One' },
];

export default function Arrival() {
  const { d } = useS();
  const eng = useEngine();
  const [name, setName] = useState('');
  const [guise, setGuise] = useState<Guise | null>(null);
  const field = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const ready = !!name.trim() && !!guise;

  useEffect(() => {
    document.title = 'StepSAFE :: The Praxis';
    window.scrollTo(0, 0);
    /* the statement rises once the frame is painted; under reduced motion it is simply there */
    const el = root.current;
    if (el) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) el.classList.add('still');
      requestAnimationFrame(() => requestAnimationFrame(() => el.querySelectorAll('[data-reveal]').forEach(x => x.classList.add('in'))));
    }
    /* on a desktop the cursor waits in the field; on a phone the keyboard stays down until they tap it */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) window.setTimeout(() => field.current?.focus(), 1300);
  }, []);

  function begin(e?: React.FormEvent) {
    e?.preventDefault();
    if (!ready) return;
    const handle = name.trim();
    d({ t: 'onboard', handle, guise: guise! });
    d({ t: 'touch-day' });
    d({ t: 'seva-msg', msg: { id: uid(), from: 'seva', at: Date.now(), tone: 'first-login',
      text: 'I am Seva, your guide here. ' +
        'We begin with UNIT ONE: you and me. Everything else is earned. ' +
        'Open the Chapters when you are ready, ' + handle + '. Take the first Step.' } });
    eng.fireMilestone('onboarded');
  }

  return (
    <div ref={root} className="lx ar">
      <header className="ar-top">
        <button className="lx-brand" onClick={() => d({ t: 'route', view: 'welcome' })} aria-label="StepSAFE, back to the welcome page">
          <svg viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="5.5" /><circle cx="8.5" cy="12" r="5.5" /><circle cx="15.5" cy="12" r="5.5" /><circle cx="12" cy="12" r="1.6" className="dot" /></svg>
          <span>StepSAFE</span>
        </button>
      </header>

      <main className="ar-main">
        <StageCanvas chapter={0} className="ar-stage" />
        <form className="ar-form" onSubmit={begin}>
          <Statement as="h1" className="ar-st" lines={['STEP.', 'STRONG.']} start={0.2} beat={0.22} rest={0.25} />

          <label className="ar-field lx-in" style={{ ['--d' as string]: '0.9s' }}>
            <span className="ar-label">Your operator handle</span>
            <input ref={field} value={name} onChange={e => setName(e.target.value)} placeholder="how the unit will know you"
              maxLength={40} autoComplete="nickname" autoCapitalize="words" spellCheck={false} enterKeyHint="go" />
          </label>

          <fieldset className="ar-guides lx-in" style={{ ['--d' as string]: '1.1s' }}>
            <legend className="ar-label">Your security guide: choose their guise</legend>
            <div className="ar-choice" role="group">
              {GUISES.map(g => (
                <button key={g.key} type="button" className={'ar-guise' + (guise === g.key ? ' on' : '')} aria-pressed={guise === g.key} onClick={() => setGuise(g.key)}>
                  <i aria-hidden />{g.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="ar-go lx-in" style={{ ['--d' as string]: '1.3s' }}>
            <button type="submit" className={'lx-btn key' + (ready ? ' ready' : '')} disabled={!ready}>Begin UNIT ONE</button>
          </div>
        </form>
      </main>
    </div>
  );
}
