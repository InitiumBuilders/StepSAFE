/* THE WELCOME PAGE ON ITS OWN. A first visit and every /welcome link render the welcome page without the
   rest of the Praxis, so a phone on a slow link shows the opening in seconds instead of waiting for every
   chapter, guide and room. The page reads only the few settings it needs from the saved record (whether
   the visitor has begun, the light, the text size, calm motion). The app comes down quietly while the
   visitor reads (main.tsx) and takes over when they begin. */

import React from 'react';
import type { Root } from 'react-dom/client';
import { Field } from './lib/field';
import Lander from './views/Lander';

/** the saved record's key, the same one lib/state reads */
const KEY = 'stepsafe-praxis-v1';

export interface Seen { onboarded: boolean; theme?: string; textSize?: string; motion?: string }

export function readRecord(): Seen {
  try {
    const r = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
    return { onboarded: !!r.onboarded, theme: r.theme, textSize: r.textSize, motion: r.motion };
  } catch {
    return { onboarded: false };
  }
}

/** draw the welcome page into the root; `begin` is called with the door the visitor chose */
export function mountWelcome(root: Root, begin: (go?: string) => void) {
  const rec = readRecord();
  const html = document.documentElement;
  if (rec.theme) html.dataset.theme = rec.theme;
  html.dataset.text = rec.textSize && rec.textSize !== 'standard' ? rec.textSize : '';
  html.dataset.motion = rec.motion === 'calm' ? 'calm' : '';
  root.render(
    <React.StrictMode>
      <canvas id="field" aria-hidden />
      <Lander onBegin={go => { Field.stop(); begin(go); }} entered={rec.onboarded} />
    </React.StrictMode>
  );
  requestAnimationFrame(() => { Field.start(); Field.setLight(rec.theme === 'meridian'); });
}
