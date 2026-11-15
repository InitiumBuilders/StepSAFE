/* /trust on its own: StepSAFE's own record for anyone, a reviewer included, with no welcome page and no handle to
   choose first. main.tsx loads this file only for that path, the way /MOTRUS and /PAXT are drawn without the rest
   of the Praxis. The page writes nothing to this browser's storage. It keeps the saved record's theme, calm motion
   and text size when there is one; a first visit sees the night theme. */

import React from 'react';
import type { Root } from 'react-dom/client';
import { TrustView } from './TrustView';

const THEMES = ['nocturne', 'meridian', 'mov'];

export function mountTrust(root: Root) {
  const html = document.documentElement;
  try {
    const r = JSON.parse(localStorage.getItem('stepsafe-praxis-v1') || '{}') || {};
    html.dataset.theme = THEMES.includes(r.theme) ? r.theme : 'nocturne';
    html.dataset.motion = r.motion === 'calm' ? 'calm' : '';
    html.dataset.text = r.textSize && r.textSize !== 'standard' ? r.textSize : '';
  } catch { html.dataset.theme = 'nocturne'; }
  document.title = 'StepSAFE’s own record · StepSAFE';
  root.render(
    <React.StrictMode>
      <main id="main" className="ownr-alone">
        <TrustView alone />
      </main>
    </React.StrictMode>
  );
}
