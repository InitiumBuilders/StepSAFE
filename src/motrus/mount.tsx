/* /MOTRUS, /ankras and /PAXT on their own: the three proposal pages, drawn without the rest of the Praxis. They keep their own
   dark ground and honour the saved record's calm motion and text size. main.tsx loads this file only for those paths. */

import React from 'react';
import type { Root } from 'react-dom/client';
import { MotrusPage } from './MotrusPage';
import { AnkrasPage } from './AnkrasPage';
import { PaxtPage } from './PaxtPage';
import { COPY } from './copy';
import { AK } from './ankras-copy';
import { PX } from './paxt-copy';

export type Page = 'motrus' | 'ankras' | 'paxt';

export function mountMotrus(root: Root, page: Page = 'motrus') {
  const html = document.documentElement;
  try {
    const r = JSON.parse(localStorage.getItem('stepsafe-praxis-v1') || '{}') || {};
    html.dataset.motion = r.motion === 'calm' ? 'calm' : '';
    html.dataset.text = r.textSize && r.textSize !== 'standard' ? r.textSize : '';
  } catch { /* storage blocked: the page draws with its defaults */ }
  html.dataset.theme = 'nocturne';
  document.body.classList.add('mt-on');
  document.title = page === 'ankras' ? AK.title : page === 'paxt' ? PX.title : COPY.title;
  root.render(
    <React.StrictMode>
      {page === 'ankras' ? <AnkrasPage /> : page === 'paxt' ? <PaxtPage /> : <MotrusPage />}
    </React.StrictMode>
  );
}
