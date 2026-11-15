/* The Back button, the back gesture, and addresses. The app keeps its place in its own state. Each page a learner
   opens becomes an entry in the tab's history, holding the route and how far the page was scrolled, and Back and
   Forward walk those entries. A sheet or a full-screen view that is open holds an entry too, so Back closes it
   first.

   A place has an address: the part after the # names it, as #/room/<id> or #/step/<id>, so it can be shared,
   bookmarked, opened in another tab, and found again after a reload. It is kept after the # on purpose. A browser
   does not send that part to a server, so where a learner is in the app is never in anyone's logs. */

import { useEffect, useRef } from 'react';
import type { ViewKey } from './state';

export interface Route { view: ViewKey; id?: string; sub?: string }
interface Entry { ss: Route; y?: number; ov?: string }

/* A sub that names a place (a tab, a term, a deck, one decision of a room) is kept. One that asks for something
   once (a ceremony, a question carried to Seva, a world opened on arrival, a week's pressure) is left out, so
   walking back does not ask for it again. */
function place(r: Route): Route {
  const sub = r.sub || '';
  const kept = r.view === 'modux' || r.view === 'guides' || r.view === 'sim' || r.view === 'read' || (r.view === 'study' && sub !== 'close');
  const out: Route = { view: r.view };
  if (r.id) out.id = r.id;
  if (sub && kept) out.sub = sub;
  return out;
}
const eq = (a: Route, b: Route) => {
  const x = place(a), y = place(b);
  return x.view === y.view && (x.id || '') === (y.id || '') && (x.sub || '') === (y.sub || '');
};

/* ---------- addresses ---------- */

const MODUX_TABS = ['gauges', 'systems', 'models', 'motrus', 'stacks', 'courses', 'web'];
const STUDY_TABS = ['foryou', 'deck', 'test', 'atlas', 'shelf', 'progress'];
const PLAIN: Partial<Record<ViewKey, string>> = {
  chapters: 'chapters', practice: 'practice', steps: 'steps', unit: 'unit', profile: 'profile',
  next: 'next', seva: 'seva', settings: 'settings', check: 'check', trust: 'trust',
};
/* an id in an address: the curriculum's own ids and a forged gauge's, nothing else */
const SAFE = /^[A-Za-z0-9][A-Za-z0-9._~-]{0,119}$/;
const seg = (x: string) => (SAFE.test(x) ? x : '');
/* a Dash Platform identifier, as an address may carry one */
const CHAIN_ID = /^[1-9A-HJ-NP-Za-km-z]{42,44}$/;
/* one decision of a room taken by itself: 'one' is its first, 'one-3' its third */
const ONE = /^one(-([2-9]|[1-9][0-9]))?$/;

/** the part after the # for a route; empty for Ground and for a place that has no address of its own */
export function addressOf(r: Route): string {
  const id = r.id ? seg(r.id) : '';
  switch (r.view) {
    case 'chapter': return id ? '/chapter/' + id : '/chapters';
    case 'step': return id ? '/step/' + id : '/chapters';
    case 'sim': return id ? '/room/' + id + (r.sub && ONE.test(r.sub) ? '/' + r.sub : '') : '/practice';
    case 'modux': {
      if (r.id && r.id.startsWith('sys:') && seg(r.id.slice(4))) return '/system/' + r.id.slice(4);
      return '/models' + (r.sub && r.sub !== 'gauges' && MODUX_TABS.includes(r.sub) ? '/' + r.sub : '');
    }
    case 'modux-model': return id ? '/model/' + id : '/models/models';
    case 'modux-stack': return id ? '/stack/' + id : '/models/stacks';
    case 'modux-gauge': return id ? '/gauge/' + id : '/models';
    case 'guides': return id ? '/guide/' + id : r.sub && seg(r.sub) ? '/glossary/' + r.sub : '/guides';
    case 'study': {
      const tab = (r.sub || '').split(':')[0];
      return '/study' + (tab !== 'foryou' && STUDY_TABS.includes(tab) ? '/' + tab : '');
    }
    /* a token's reading: the contract it was read from, and the network when it is not mainnet */
    case 'read': return '/read' + (id && CHAIN_ID.test(id) ? '/' + id + (r.sub === 'testnet' ? '/testnet' : '') : '');
    case 'home': case 'welcome': return '';
    default: return PLAIN[r.view] ? '/' + PLAIN[r.view] : '';
  }
}

/** the route an address names, or null when it names none (an empty address, a shared link's payload, a typo) */
export function routeOf(hash: string): Route | null {
  const m = /^#\/([a-z]+)(?:\/([^/#?&]+))?(?:\/([^/#?&]+))?\/?$/.exec(hash || '');
  if (!m) return null;
  const head = m[1];
  const a = m[2] ? seg(m[2]) : '', b = m[3] ? seg(m[3]) : '';
  if ((m[2] && !a) || (m[3] && !b)) return null;
  const only = (r: Route) => (a || b ? null : r);
  switch (head) {
    case 'chapters': return only({ view: 'chapters' });
    case 'chapter': return a && !b ? { view: 'chapter', id: a } : null;
    case 'step': return a && !b ? { view: 'step', id: a } : null;
    case 'practice': return only({ view: 'practice' });
    case 'room': return !a ? null : !b ? { view: 'sim', id: a } : ONE.test(b) ? { view: 'sim', id: a, sub: b } : null;
    case 'models': return b ? null : !a ? { view: 'modux' } : MODUX_TABS.includes(a) ? { view: 'modux', sub: a } : null;
    case 'system': return a && !b ? { view: 'modux', sub: 'systems', id: 'sys:' + a } : null;
    case 'model': return a && !b ? { view: 'modux-model', id: a } : null;
    case 'stack': return a && !b ? { view: 'modux-stack', id: a } : null;
    case 'gauge': return a && !b ? { view: 'modux-gauge', id: a } : null;
    case 'guides': return only({ view: 'guides' });
    case 'guide': return a && !b ? { view: 'guides', id: a } : null;
    case 'glossary': return a && !b ? { view: 'guides', sub: a } : null;
    case 'study': return b ? null : !a ? { view: 'study' } : STUDY_TABS.includes(a) ? { view: 'study', sub: a } : null;
    case 'read': return !a ? only({ view: 'read' }) : !CHAIN_ID.test(a) ? null : !b ? { view: 'read', id: a } : b === 'testnet' ? { view: 'read', id: a, sub: 'testnet' } : null;
    default: {
      const view = (Object.keys(PLAIN) as ViewKey[]).find(k => PLAIN[k] === head);
      return view ? only({ view }) : null;
    }
  }
}

/* a link that carries something (a shared profile, gauge, result or study set) keeps its payload until it is read */
const carried = () => /(?:^|[#&])[pgrs]=/.test(location.hash);
const urlOf = (r: Route) => {
  const a = addressOf(r);
  return location.pathname + location.search + (a ? '#' + a : carried() ? location.hash : '');
};

/** the whole link to a place, for sharing */
export function linkTo(r: Route): string {
  const a = addressOf(r);
  return location.origin + '/' + (a ? '#' + a : '');
}

/* the place the address named when the app was opened, read once */
const ARRIVED: Route | null = typeof location !== 'undefined' ? routeOf(location.hash) : null;
/** the place the address named when the app was opened, if it named one */
export const arrival = (): Route | null => ARRIVED;

/* ---------- the walk ---------- */

let last: Route = { view: 'home' };       // the route history last heard about
let popping: Route | null = null;         // the route a Back or Forward is restoring
let restoreY: number | null = null;       // how far that page was scrolled when it was left
let leftY = 0;                            // how far the page being left is scrolled
let ownBack = false;                      // this module asked for the step back that is under way
let replaceNext = false;                  // the next route takes the current entry instead of adding one
let navigate: ((r: Route) => void) | null = null;
let settling = 0;
const overlays = new Map<string, () => void>();

const read = (): Entry | null => {
  const st = history.state as Entry | null;
  return st && typeof st === 'object' && st.ss && typeof st.ss.view === 'string' ? st : null;
};
const write = (how: 'push' | 'replace', e: Entry) => {
  /* a browser that refuses (too many entries in a short time) carries on without the entry */
  try { if (how === 'push') history.pushState(e, '', urlOf(e.ss)); else history.replaceState(e, '', urlOf(e.ss)); } catch { /* no entry */ }
};

/** once every overlay has closed, an entry one of them left on top is removed */
function tidy() {
  if (overlays.size || ownBack || !read()?.ov) return;
  ownBack = true;
  window.setTimeout(() => { ownBack = false; }, 700);
  history.back();
}

export const Back = {
  /** once, when the app starts: `go` opens a route, `known` says whether a route names a place that exists */
  start(route: Route, go: (r: Route) => void, known: (r: Route) => boolean = () => true): () => void {
    navigate = go;
    last = route;
    try { history.scrollRestoration = 'manual'; } catch { /* the browser restores scroll its own way */ }
    write('replace', { ss: place(route) });
    const onPop = (e: PopStateEvent) => {
      const st = e.state && typeof e.state === 'object' && e.state.ss ? e.state as Entry : null;
      let to: Route;
      if (st) to = st.ss;
      else {
        /* An address typed or followed by hand has no entry of ours: the address is read, and the entry is given
           its route. One that names no place, or a place that does not exist, opens Ground and is put right. */
        const named = routeOf(location.hash);
        to = named && known(named) ? named : { view: 'home' };
        write('replace', { ss: place(to) });
      }
      if (ownBack) {
        ownBack = false;
        /* a page was opened while a closed sheet's entry was being removed: return to that page */
        if (!eq(to, last)) history.forward();
        return;
      }
      if (overlays.size) { const fns = [...overlays.values()]; overlays.clear(); fns.forEach(f => f()); }
      if (eq(to, last)) return;
      popping = to;
      restoreY = st && typeof st.y === 'number' ? st.y : 0;
      navigate?.(to);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  },

  /** just before a route changes: the page being left says how far it was scrolled */
  leaving(): void { leftY = window.scrollY; },

  /** the next route replaces the page it is leaving: for an address that named a place that does not exist */
  redirect(): void { replaceNext = true; },

  /** after the route has changed. Returns the scroll to restore when Back or Forward brought the page, else null. */
  route(route: Route): number | null {
    if (popping && eq(route, popping)) {
      popping = null; last = route;
      const y = restoreY; restoreY = null;
      return y ?? 0;
    }
    popping = null; restoreY = null; settling++;
    if (eq(route, last)) { last = route; return null; }
    const cur = read();
    if (replaceNext || (cur && cur.ov)) write('replace', { ss: place(route) });   // a sheet's entry becomes the page chosen from it
    else {
      if (cur) write('replace', { ...cur, y: Math.round(leftY) });
      write('push', { ss: place(route) });
    }
    replaceNext = false;
    last = route;
    return null;
  },

  /** scroll to where the page was, waiting for a page that is still arriving to grow tall enough */
  settle(y: number): void {
    const run = ++settling;
    let n = 0;
    const stop = () => { if (settling === run) settling++; };
    window.addEventListener('touchstart', stop, { once: true, passive: true });
    window.addEventListener('wheel', stop, { once: true, passive: true });
    const tick = () => {
      if (settling !== run) return;
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo(0, Math.min(y, max));
      if (max < y && n++ < 90) window.requestAnimationFrame(tick);
    };
    tick();
  },

  opened(id: string, close: () => void): void {
    overlays.set(id, close);
    write(read()?.ov ? 'replace' : 'push', { ss: place(last), ov: id });
  },
  closed(id: string): void {
    overlays.delete(id);
    window.setTimeout(tidy, 0);
  },
};

/** while `open`, Back closes this sheet or full-screen view and stays on the page under it */
export function useBackCloses(open: boolean, close: () => void, id: string): void {
  const fn = useRef(close);
  fn.current = close;
  useEffect(() => {
    if (!open) return;
    Back.opened(id, () => fn.current());
    return () => Back.closed(id);
  }, [open, id]);
}
