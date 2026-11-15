/* THE PRAXIS AS AN APP. Registers the service worker on a built site, keeps
   the install prompt when the browser offers one, and asks the worker to
   keep every file for offline use. Everything here is on the device; nothing
   is sent anywhere. */

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

let deferred: InstallPrompt | null = null;
const listeners = new Set<() => void>();

export function pwaSupported(): boolean {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
}

export function registerPwa() {
  if (!pwaSupported() || !import.meta.env.PROD) return;
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => { /* the site still works without the keep */ }); });
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e as InstallPrompt; listeners.forEach(l => l()); });
  window.addEventListener('appinstalled', () => { deferred = null; listeners.forEach(l => l()); });
}

/** true while the browser is offering to install */
export function canInstall(): boolean { return !!deferred; }
export function onInstallChange(l: () => void): () => void { listeners.add(l); return () => { listeners.delete(l); }; }

export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'none'> {
  if (!deferred) return 'none';
  const p = deferred;
  await p.prompt();
  const r = await p.userChoice;
  deferred = null;
  listeners.forEach(l => l());
  return r.outcome;
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function isIos(): boolean {
  return typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export interface KeepProgress { done: number; total: number; failed: number; finished: boolean; error?: string }

/** ask the worker to keep every file; progress arrives as the worker fetches */
export async function keepAll(onProgress: (p: KeepProgress) => void): Promise<void> {
  if (!pwaSupported()) { onProgress({ done: 0, total: 0, failed: 0, finished: true, error: 'no-worker' }); return; }
  const reg = await navigator.serviceWorker.ready.catch(() => null);
  const sw = reg?.active;
  if (!sw) { onProgress({ done: 0, total: 0, failed: 0, finished: true, error: 'no-worker' }); return; }
  await new Promise<void>(resolve => {
    const ch = new MessageChannel();
    ch.port1.onmessage = ev => {
      const m = ev.data || {};
      if (m.type === 'keep-progress') onProgress({ done: m.done, total: m.total, failed: m.failed, finished: false });
      else if (m.type === 'keep-done') { onProgress({ done: m.done, total: m.total, failed: m.failed, finished: true }); resolve(); }
      else if (m.type === 'keep-error') { onProgress({ done: 0, total: 0, failed: 0, finished: true, error: m.error }); resolve(); }
    };
    sw.postMessage({ type: 'keep-all' }, [ch.port2]);
  });
}

/** what is kept right now: the count of files in the keep */
export async function keptCount(): Promise<number> {
  if (typeof caches === 'undefined') return 0;
  try { const keys = await caches.keys(); let n = 0; for (const k of keys) if (k.startsWith('stepsafe-')) n += (await (await caches.open(k)).keys()).length; return n; } catch { return 0; }
}

/** the files the build listed, so the page can say how many there are */
export async function offlineTotal(): Promise<number> {
  try { const r = await fetch('/offline-manifest.json', { cache: 'no-store' }); const j = await r.json(); return Array.isArray(j.files) ? j.files.length : 0; } catch { return 0; }
}
