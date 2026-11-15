// Serves dist/ the way Vercel does for this project: every header in vercel.json, and every path that is not a file
// rewritten to index.html. For testing the Content-Security-Policy before a deploy.
//   node scripts/serve-dist.mjs [port]
import http from 'node:http';
import { gzipSync } from 'node:zlib';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const port = Number(process.argv[2] || 5189);
const root = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const conf = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const headers = conf.headers.flatMap((h) => h.headers);
const gzipCache = new Map();
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.txt': 'text/plain' };

http.createServer((req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  let file = join(root, path);
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(root, 'index.html');
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
}).listen(port, () => console.log('dist with vercel.json headers: http://localhost:' + port));
