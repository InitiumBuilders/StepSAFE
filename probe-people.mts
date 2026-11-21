/* PROBE: the people count. peopleOf and peopleCount read the people an
   organisation serves from its sector line. The first eleven cases are
   known systems' serves lines as scripts/outlier-gen.mts passes them on:
   the first 120 characters of research/outlier/final/<id>.json, eight copied
   on 2026-10-18 and three on 2026-11-20. The rest test one rule each. The final entries on disk are
   printed at the end for reading and are not checked, since they change as
   the research is written. Run: npx tsx probe-people.mts */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { peopleOf, peopleCount } from './src/lib/people';

const CASES: [string, string, string | null, number][] = [
  ['anthropic', "Businesses, developers and individual users of the Claude models, with over 300,000 business customers in September 2025", '300,000 customers', 300000],
  ['microsoft', "Microsoft serves more than 1,000,000,000 customers, from households to governments, by the CSRB's 2024 count. They work ", '1,000,000,000 customers', 1000000000],
  ['github', "Software developers, open source maintainers and companies. Octoverse 2025 counted more than 180 million developers and ", '180 million developers', 180000000],
  ['google', "Billions of people and businesses. Alphabet's FY2025 10-K counts 15 products with over half a billion users, seven of th", null, 0],
  ['x', "People who read and post news as it happens: 237.8 million a day in Q2 2022, Twitter's last count. That figure counted m", '237.8 million people', 237800000],
  ['youtube', "Viewers, creators, rights holders and advertisers in over 100 countries. YouTube's press page counts over 20 million upl", null, 0],
  ['reddit', "People who read and post in interest-based communities: 130.3 million daily and 514.6 million weekly active uniques in Q", '514.6 million people', 514600000],
  ['farcaster', "People who post and read on Farcaster apps, and developers who build clients and mini apps on its open data. Dan Romero ", null, 0],
  ['web-pki', "Everyone who opens a secure website or app. Let's Encrypt alone served 762 million websites at the end of 2025 by ISRG's", null, 0],
  ['allstate', "About 16 million households, by an undated allstate.com figure read in October 2026. Allstate counted 211 million polici", '16 million households', 16000000],
  ['package-registries', "Developers and the software they build, which installs code from npm and PyPI. pypi.org counted 918,959 projects and 1,1", null, 0],
  ['no noun', 'Municipal water for a town of 30,000', '30,000 people', 30000],
  ['million', 'Regional carrier, 2 million subscribers', '2 million subscribers', 2000000],
  ['billion with decimals', 'Up to 1.5 billion users in March 2025', '1.5 billion users', 1500000000],
  ['small number', 'Regional hospital network, 6 sites', null, 0],
  ['year-sized count', 'A village of 2000 residents', '2000 residents', 2000],
  ['since', 'Members since 1998', null, 0],
  ['in, then a noun', 'In 2024 users doubled', null, 0],
  ['money', 'Revenue of $281.7 billion and 3 million customers', '3 million customers', 3000000],
  ['things', 'Over 20 million uploads a day', null, 0],
  ['cut mid-number', 'More than 1,000,0', null, 0],
  ['no number', 'A thing with no count', null, 0],
];

const problems: string[] = [];
for (const [id, line, label, count] of CASES) {
  const got = peopleOf(line), n = peopleCount(line);
  if (got !== label || n !== count) problems.push(id + ': read ' + JSON.stringify(got) + ' / ' + n + ', want ' + JSON.stringify(label) + ' / ' + count);
  console.log(id.padEnd(22), String(got).padEnd(26), n);
}

const FINAL = join(process.cwd(), 'research', 'outlier', 'final');
if (existsSync(FINAL)) {
  console.log('\nfinal entries on disk (not checked)');
  for (const f of readdirSync(FINAL).filter(f => f.endsWith('.json') && !f.startsWith('_'))) {
    try {
      const e = JSON.parse(readFileSync(join(FINAL, f), 'utf-8'));
      const line = typeof e.serves === 'string' ? e.serves.trim().slice(0, 120) : '';
      console.log('  ' + f.replace(/\.json$/, '').padEnd(20), peopleOf(line) || 'no count');
    } catch { console.log('  ' + f + ': could not read'); }
  }
}

console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems) console.log(' - ' + p);
process.exit(problems.length ? 1 : 0);
