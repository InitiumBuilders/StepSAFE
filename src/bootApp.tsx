/* THE PRAXIS ITSELF: everything the welcome page does not need. main.tsx loads this when a returning learner
   opens the app, and in the background while a first visitor reads the welcome page. */

import React from 'react';
import type { Root } from 'react-dom/client';
import { StateProvider } from './lib/state';
import { ToastHost } from './components/bits';
import { App } from './App';
import { MotrusProvider } from './lib/motrus';
import { profileFromUrl } from './lib/share';
import { SharedProfileView } from './views/SharedProfileView';

const APP_TITLE = 'StepSAFE :: The Praxis';

/** `arrived` is the door a visitor chose on the welcome page, so the app opens there and not on the welcome page again */
export function renderApp(root: Root, arrived?: string) {
  document.title = APP_TITLE;
  root.render(
    <React.StrictMode>
      <StateProvider>
        <ToastHost>
          <MotrusProvider>
            <App arrived={arrived} />
          </MotrusProvider>
        </ToastHost>
      </StateProvider>
    </React.StrictMode>
  );
}

/* A shared profile link renders read-only and never mounts the app, so opening
   somebody else's record cannot read, write, or disturb your own. */
export async function boot(root: Root) {
  const shared = await profileFromUrl();
  if (shared) {
    document.title = shared.handle + ' — Praxis Profile :: ' + APP_TITLE;
    root.render(
      <React.StrictMode>
        <SharedProfileView p={shared} />
      </React.StrictMode>
    );
    return;
  }
  renderApp(root);
}

/* The fragment can arrive after load — pasted into an open tab, followed from
   an in-page link, or restored by the browser. Without this, such a link
   silently does nothing, which is indistinguishable from a broken link. */
export function watchFragment(root: Root) {
  let lastHash = location.hash;
  window.addEventListener('hashchange', () => {
    if (location.hash === lastHash) return;
    const hadProfile = /(?:^|[#&])p=/.test(lastHash);
    const hasProfile = /(?:^|[#&])p=/.test(location.hash);
    lastHash = location.hash;
    if (hasProfile) boot(root);
    else if (hadProfile) renderApp(root);   // navigated back out of a shared profile
  });
}
