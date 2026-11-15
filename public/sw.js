/* THE PRAXIS ON THE DEVICE. A small service worker: the page itself is
   fetched from the network first and kept as the offline fallback; the
   hashed assets are kept the first time they are fetched; and on request
   every file in the offline manifest is fetched and kept, so the whole
   Praxis opens with no signal. Nothing is sent anywhere. */

const CACHE = 'stepsafe-v3';
const SHELL = ['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  /* the shell: network first, the kept page when there is none */
  if (req.mode === 'navigate') {
    /* A page with a file name (/privacy.html, /.well-known/security.txt) is not the app: it passes through and is not
       kept, or it would replace the kept app. The app is kept only from a good answer that is a page, so an error page
       met during a deploy never becomes what opens offline. */
    if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return;
    e.respondWith(fetch(req).then(r => {
      if (r.ok && /text\/html/i.test(r.headers.get('content-type') || '')) { const copy = r.clone(); caches.open(CACHE).then(c => c.put('/', copy)); }
      return r;
    }).catch(() => caches.match('/')));
    return;
  }
  /* the hashed assets and the icons: kept once, served from the keep */
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/schema/') || url.pathname === '/manifest.webmanifest') {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; })));
    return;
  }
  /* the API and everything else: the network, and nothing kept */
});

/* keep everything: the page asks, the worker fetches every file the build listed, and reports as it goes */
self.addEventListener('message', e => {
  const data = e.data || {};
  if (data.type !== 'keep-all') return;
  const port = e.ports && e.ports[0];
  const say = msg => { if (port) port.postMessage(msg); };
  (async () => {
    try {
      const res = await fetch('/offline-manifest.json', { cache: 'no-store' });
      const list = await res.json();
      const files = Array.isArray(list.files) ? list.files : [];
      const c = await caches.open(CACHE);
      let done = 0, failed = 0;
      for (const f of files) {
        try {
          const hit = await c.match(f);
          if (!hit) { const r = await fetch(f); if (r.ok) await c.put(f, r); else failed++; }
          done++;
        } catch { failed++; done++; }
        say({ type: 'keep-progress', done, total: files.length, failed });
      }
      say({ type: 'keep-done', done, total: files.length, failed });
    } catch (err) {
      say({ type: 'keep-error', error: String(err && err.message || err) });
    }
  })();
});
