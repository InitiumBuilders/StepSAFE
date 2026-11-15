/* The people an organisation serves, read from its sector line.
   "Municipal water for a town of 30,000" gives 30,000 people; "Regional
   telecom carrier, 600,000 subscribers" gives 600,000 subscribers; "2 million
   subscribers" gives 2 million subscribers. A sector line with no number
   gives nothing, and the page shows nothing for it. A year, a sum of money
   or a count of things is skipped: "Q2 2022", "$281.7 billion" and
   "20 million uploads" give nothing. */

const NOUN_WORDS = ['people', 'residents', 'members', 'subscribers', 'customers', 'accounts', 'staff', 'patients', 'households', 'homes', 'citizens', 'voters', 'users', 'installs', 'businesses', 'developers'];
const NOUNS = new RegExp('(' + NOUN_WORDS.join('|') + ')', 'i');
/* a number followed by one of these counts things */
const THINGS = ['uploads', 'videos', 'posts', 'messages', 'searches', 'queries', 'requests', 'downloads', 'transactions', 'payments', 'repositories', 'packages', 'products', 'apps', 'sites', 'pages', 'files', 'countries', 'cities', 'languages', 'miles', 'kilometres', 'kilometers', 'acres', 'beds', 'tons', 'hours', 'dollars', 'euros', 'pounds', 'revenue', 'sales'];
/* a number with or without comma groups, then million or billion if one follows */
const NUMBER = /(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)(?:\s*(million|billion)\b)?/gi;
/* written right before a four-digit number, one of these makes it a year */
const YEAR_CUE = /\b(?:Q[1-4]|H[12]|FY|in|since|as of|by|until|through|jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\.?\s*$/i;
/* a currency sign or code right before a number */
const MONEY = /(?:[$€£¥]|\b(?:USD|EUR|GBP))\s*$/i;

interface Count { text: string; value: number; end: number }

/* what a number counts, from the first people noun or thing noun in the next
   three words before any punctuation. A line cut at its length limit can end
   inside the noun ("20 million upl"), so a cut last word that begins a thing
   noun, and no people noun, counts as that thing. */
function unitAfter(sector: string, end: number): 'people' | 'things' | null {
  const clause = sector.slice(end).split(/[.,;:!?()]/)[0];
  const all = clause.split(/\s+/).filter(Boolean);
  const words = all.slice(0, 3).map(w => w.toLowerCase().replace(/[^a-z]/g, ''));
  const cut = all.length <= 3 && end + clause.length === sector.length && /\w$/.test(clause);
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (NOUN_WORDS.includes(w)) return 'people';
    if (THINGS.includes(w)) return 'things';
    if (cut && i === words.length - 1 && w.length >= 3 && THINGS.some(t => t.startsWith(w)) && !NOUN_WORDS.some(n => n.startsWith(w))) return 'things';
  }
  return null;
}

function counts(sector: string): Count[] {
  const out: Count[] = [];
  for (const m of sector.matchAll(NUMBER)) {
    const at = m.index || 0, end = at + m[0].length;
    /* part of a longer token: FY2025, ISO27001, or a number cut short ("1,000,0") */
    if (/[\w.,]/.test(sector.charAt(at - 1)) || /^[.,]?\d/.test(sector.slice(end))) continue;
    if (MONEY.test(sector.slice(0, at))) continue;
    const unit = unitAfter(sector, end);
    if (unit === 'things') continue;
    const digits = m[1].replace(/,/g, '');
    if (m[2]) {
      out.push({ text: m[1] + ' ' + m[2].toLowerCase(), value: Math.round(parseFloat(digits) * (/^b/i.test(m[2]) ? 1e9 : 1e6)), end });
    } else if (m[1].includes(',') || /^\d{4,}$/.test(digits)) {
      const value = parseInt(digits, 10);
      /* a bare four-digit number from 1900 to 2100 is a year when a time word comes right before it or no people noun follows it */
      if (/^\d{4}$/.test(m[1]) && value >= 1900 && value <= 2100 && (YEAR_CUE.test(sector.slice(0, at)) || unit !== 'people')) continue;
      out.push({ text: m[1], value, end });
    }
  }
  return out;
}

function largest(sector: string): Count | null {
  let best: Count | null = null;
  for (const c of counts(sector)) if (!best || c.value > best.value) best = c;
  return best;
}

/** "30,000 residents", or null when the sector line carries no count */
export function peopleOf(sector: string): string | null {
  const best = largest(sector);
  if (!best) return null;
  const noun = NOUNS.exec(sector.slice(best.end, best.end + 30));
  return best.text + ' ' + (noun ? noun[1].toLowerCase() : 'people');
}

/** the count itself, 0 when the sector line carries none */
export function peopleCount(sector: string): number {
  return largest(sector)?.value || 0;
}
