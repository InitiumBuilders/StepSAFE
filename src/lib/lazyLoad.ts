/* A lazily loaded part of the app, built to survive a deploy. A page left open across a deploy
   still asks for the old build's file, which the new deployment no longer has. When that import
   fails, the page reloads once to pick up the new build. A second failure in the same session is
   real, so it is thrown for the boundary to show. */

import { lazy, type ComponentType } from 'react';

const KEY = 'stepsafe-reloaded-for-build';

export function lazyLoad<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return lazy(() => load().then(m => {
    try { sessionStorage.removeItem(KEY); } catch { /* storage blocked */ }
    return m;
  }).catch(err => {
    let once = false;
    try { once = !sessionStorage.getItem(KEY); if (once) sessionStorage.setItem(KEY, String(Date.now())); } catch { once = false; }
    if (once) { window.location.reload(); return new Promise<{ default: T }>(() => { /* the reload takes over */ }); }
    throw err;
  }));
}
