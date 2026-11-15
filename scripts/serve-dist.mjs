// Serves dist/ the way Vercel does for this project: every header in vercel.json, and every path that is not a file
// rewritten to index.html. For testing the Content-Security-Policy before a deploy.
//   node scripts/serve-dist.mjs [port]
// It answers this machine only (127.0.0.1), and only with files inside dist/. Until 2026-11-15 it listened on every
// network interface and joined the decoded path onto dist/ unchecked, so a request with ../ in it could read any file
// the account could; CodeQL's first run on the public copy found it (js/path-injection).
import http from 'node:http';
import { gzipSync } from 'node:zlib';
import { readFileSync, statSync } from 'node:fs';
import { join, extname, resolve, sep } from 'node:path';

const port = Number(process.argv[2] || 5189);
const root = resolve(new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const index = join(root, 'index.html');
const conf = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const headers = conf.headers.flatMap((h) => h.headers);
const gzipCache = new Map();
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.txt': 'text/plain' };

/** the file a request names, only ever inside dist/: anything else, a path that would leave it included, gets
   index.html, as an unknown path does on Vercel */
function fileFor(url) {
  let path;
  try { path = decodeURIComponent(String(url || '/').split('?')[0]); } catch { return index; }
  if (path.includes('\0')) return index;
  const file = resolve(root, '.' + sep + path);
  if (!file.startsWith(root + sep)) return index;
  try { return statSync(file).isFile() ? file : index; } catch { return index; }
}

http.createServer((req, res) => {
  const file = fileFor(req.url);
  /* plain-http localhost cannot honour upgrade-insecure-requests (it would send the page's own files to https), so this
     test server drops that one directive; production keeps it */
  for (const h of headers) res.setHeader(h.key, h.key === 'Content-Security-Policy' ? h.value.replace(/; upgrade-insecure-requests/, '') : h.value);
  res.setHeader('Content-Type', TYPES[extname(file)] || 'application/octet-stream');
  /* compressed as Vercel sends it, so a load timed here is a fair one */
  const body = readFileSync(file);
  if (/gzip/.test(req.headers['accept-encoding'] || '') && /\.(js|css|html|json|svg|webmanifest|txt)$/.test(file)) {
    res.setHeader('Content-Encoding', 'gzip');
    /* keyed by the file's time, so a rebuild is never served from the old copy */
    const key = file + ':' + statSync(file).mtimeMs;
    if (!gzipCache.has(key)) gzipCache.set(key, gzipSync(body));
    res.end(gzipCache.get(key));
  } else res.end(body);
}).listen(port, '127.0.0.1', () => console.log('dist with vercel.json headers: http://localhost:' + port + ' (this machine only)'));
