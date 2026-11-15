/* THE FIELD SIGNAL: how much the world reads, asks, discusses and researches
   a concept, from four sources that publish open data a page can read:

     Wikipedia        monthly pageviews of the closest article, last 12 months
     Hacker News      stories that mention it, all time and the last year
     Stack Exchange   questions about it on Information Security
     OpenAlex         research papers that use the phrase, by year

   Fetched only when the learner asks, from their own browser, with only the
   card's public title in the request. Kept for seven days on this device.
   Google Trends, Reddit and AI chat logs publish no open data a page can
   read, so they are not here, and nothing stands in for them. */

export interface FieldSignal {
  query: string;
  at: number;
  wiki?: { title: string; months: { month: string; views: number }[]; total: number } | null;
  hn?: { all: number; year: number } | null;
  se?: { total: number } | null;
  research?: { total: number; years: { year: number; count: number }[] } | null;
  errors: string[];
}

const KEY = 'stepsafe-signal-v1';
const TTL = 7 * 86400000;

function readCache(): Record<string, FieldSignal> {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}
function writeCache(c: Record<string, FieldSignal>) {
  try {
    const entries = Object.entries(c).sort((a, b) => b[1].at - a[1].at).slice(0, 300);
    localStorage.setItem(KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch { /* storage full: the signal still shows this time */ }
}

export function cachedSignal(query: string, now = Date.now()): FieldSignal | null {
  const hit = readCache()[query.toLowerCase()];
  return hit && now - hit.at < TTL ? hit : null;
}

/** the search phrase for a card title: parentheses and long tails trimmed */
export function signalQuery(title: string): string {
  return title.replace(/\([^)]*\)/g, ' ').replace(/[:—–].*$/, '').replace(/\s+/g, ' ').trim().split(' ').slice(0, 6).join(' ');
}

async function getJson(url: string, ms = 9000): Promise<unknown> {
  const ctl = new AbortController();
  const t = window.setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctl.signal, headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(String(r.status));
    return await r.json();
  } finally { window.clearTimeout(t); }
}

const ym = (d: Date) => d.getUTCFullYear() + String(d.getUTCMonth() + 1).padStart(2, '0') + '01';

export async function fetchSignal(query: string, now = new Date()): Promise<FieldSignal> {
  const q = query.trim().slice(0, 80);
  const out: FieldSignal = { query: q, at: Date.now(), errors: [] };
  const quoted = /\s/.test(q) ? '"' + q + '"' : q;
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const start = new Date(Date.UTC(end.getUTCFullYear() - 1, end.getUTCMonth(), 1));
  const yearAgo = Math.floor((now.getTime() - 365 * 86400000) / 1000);

  const wiki = (async () => {
    const sr = await getJson('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(q) + '&srlimit=1&srnamespace=0&format=json&origin=*') as { query?: { search?: { title: string }[] } };
    const title = sr.query?.search?.[0]?.title;
    if (!title) return null;
    const pv = await getJson('https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia.org/all-access/user/' + encodeURIComponent(title.replace(/ /g, '_')) + '/monthly/' + ym(start) + '/' + ym(end)) as { items?: { timestamp: string; views: number }[] };
    const months = (pv.items || []).map(i => ({ month: i.timestamp.slice(0, 4) + '-' + i.timestamp.slice(4, 6), views: i.views }));
    return { title, months, total: months.reduce((n, m) => n + m.views, 0) };
  })();
  const hn = (async () => {
    const all = await getJson('https://hn.algolia.com/api/v1/search?query=' + encodeURIComponent(q) + '&tags=story&hitsPerPage=0') as { nbHits?: number };
    const yr = await getJson('https://hn.algolia.com/api/v1/search?query=' + encodeURIComponent(q) + '&tags=story&hitsPerPage=0&numericFilters=created_at_i%3E' + yearAgo) as { nbHits?: number };
    return { all: all.nbHits || 0, year: yr.nbHits || 0 };
  })();
  const se = (async () => {
    const r = await getJson('https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=activity&q=' + encodeURIComponent(q) + '&site=security&filter=total') as { total?: number };
    return { total: r.total || 0 };
  })();
  const research = (async () => {
    const r = await getJson('https://api.openalex.org/works?search=' + encodeURIComponent(quoted) + '&group_by=publication_year&per_page=1') as { meta?: { count?: number }; group_by?: { key: string; count: number }[] };
    const thisYear = now.getUTCFullYear();
    const years = (r.group_by || []).map(g => ({ year: parseInt(g.key, 10), count: g.count })).filter(y => y.year >= thisYear - 7 && y.year <= thisYear).sort((a, b) => a.year - b.year);
    return { total: r.meta?.count || 0, years };
  })();

  const [w, h, s, rs] = await Promise.allSettled([wiki, hn, se, research]);
  out.wiki = w.status === 'fulfilled' ? w.value : (out.errors.push('Wikipedia'), null);
  out.hn = h.status === 'fulfilled' ? h.value : (out.errors.push('Hacker News'), null);
  out.se = s.status === 'fulfilled' ? s.value : (out.errors.push('Stack Exchange'), null);
  out.research = rs.status === 'fulfilled' ? rs.value : (out.errors.push('OpenAlex'), null);
  if (out.errors.length < 4) { const c = readCache(); c[q.toLowerCase()] = out; writeCache(c); }
  return out;
}

/** the year over year direction of research, from the last two full years */
export function researchTrend(sig: FieldSignal, now = new Date()): number | null {
  const ys = sig.research?.years || [];
  const y = now.getUTCFullYear();
  const a = ys.find(x => x.year === y - 2)?.count, b = ys.find(x => x.year === y - 1)?.count;
  if (!a || b === undefined) return null;
  return (b - a) / a;
}
