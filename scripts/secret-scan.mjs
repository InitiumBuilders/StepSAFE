// The gate before every push: scan every tracked file for keys, tokens and private key blocks. Prints the file, the
// line and the kind, never the value. Exits 1 on any hit, so scripts/keep.sh refuses to push.
//   node scripts/secret-scan.mjs
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean);
// `sk-` must start a token: news links carry words like ksk-rollover and musk-says
const PATTERNS = [
  ['anthropic key', /sk-ant-[A-Za-z0-9_-]{20,}/],
  ['openai or openrouter key', /(?<![A-Za-z0-9])sk-(?:or-v1|proj|live)?-?[A-Za-z0-9_-]{32,}/],
  ['github token', /(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}/],
  ['aws key', /AKIA[0-9A-Z]{16}/],
  ['private key block', /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/],
  ['jwt', /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/],
  ['vercel token', /vercel_blob_rw_[A-Za-z0-9]{10,}|VERCEL_OIDC_TOKEN\s*=\s*\S{20,}/],
  ['slack or telegram token', /xox[baprs]-[A-Za-z0-9-]{10,}|\b\d{8,10}:AA[A-Za-z0-9_-]{30,}\b/],
  ['stripe key', /(?:sk|rk)_live_[A-Za-z0-9]{20,}/],
  ['google api key', /AIza[0-9A-Za-z_-]{35}/],
  ['extended private key', /\bxprv[1-9A-HJ-NP-Za-km-z]{100,}\b/],
  ['assigned secret', /\b(?:api[_-]?key|secret|token|password|passwd|bearer)\b["']?\s*[:=]\s*["'][A-Za-z0-9_\-+/=.]{24,}["']/i],
];

let hits = 0;
for (const f of files) {
  if (/\.(png|jpe?g|webp|gif|ico|woff2?|mp3|wav|ogg|pdf|glb)$/i.test(f)) continue;
  let text;
  try { text = readFileSync(f, 'utf8'); } catch { continue; }
  text.split('\n').forEach((line, i) => {
    for (const [kind, rx] of PATTERNS) {
      const m = line.match(rx);
      if (m) { hits++; console.log(`${f}:${i + 1}  ${kind}  ${m[0].slice(0, 4)}… (${m[0].length} chars)`); }
    }
  });
}
console.log(`secret scan: ${files.length} files, ${hits} hits`);
process.exit(hits ? 1 : 0);
