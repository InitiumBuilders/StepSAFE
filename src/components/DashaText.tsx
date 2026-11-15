/* Dasha's words, laid out. She writes in Markdown for her own chat: paragraphs, lists, bold, code, links. This
   builds each piece as an element, so nothing she (or a page she quoted) writes is ever read as markup. A link
   opens in a new tab and only when it is https. */

import React from 'react';

const INLINE = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\[[^\]\n]+\]\(https:\/\/[^\s)]+\))|(https:\/\/[^\s<>()]+[^\s<>().,;:!?'"])|(\*[^*\s][^*\n]*\*)/g;

function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let last = 0, n = 0;
  for (const m of text.matchAll(INLINE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const k = key + '-' + n++;
    if (m[1]) out.push(<code key={k}>{m[1].slice(1, -1)}</code>);
    else if (m[2]) out.push(<strong key={k}>{m[2].slice(2, -2)}</strong>);
    else if (m[3]) {
      const mm = /^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/.exec(m[3]);
      if (mm) out.push(<a key={k} href={mm[2]} target="_blank" rel="noopener noreferrer">{mm[1]}</a>);
      else out.push(m[3]);
    } else if (m[4]) out.push(<a key={k} href={m[4]} target="_blank" rel="noopener noreferrer">{m[4].replace(/^https:\/\//, '')}</a>);
    else if (m[5]) out.push(<em key={k}>{m[5].slice(1, -1)}</em>);
    last = at + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const BULLET = /^\s*[-*•]\s+/;
const NUMBER = /^\s*\d+[.)]\s+/;
const HEAD = /^#{1,4}\s+/;

export function DashaText({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.replace(/\r/g, '').split('\n');
  let i = 0, k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    /* a fenced block is shown exactly as written */
    if (/^\s*```/.test(line)) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) body.push(lines[i++]);
      i++;
      blocks.push(<pre key={k++} className="minds-code" tabIndex={0}><code>{body.join('\n')}</code></pre>);
      continue;
    }
    if (HEAD.test(line)) { blocks.push(<p key={k++} className="minds-h">{inline(line.replace(HEAD, ''), 'h' + k)}</p>); i++; continue; }
    if (BULLET.test(line) || NUMBER.test(line)) {
      const ordered = NUMBER.test(line);
      const mark = ordered ? NUMBER : BULLET;
      const items: string[] = [];
      while (i < lines.length && mark.test(lines[i])) {
        let item = lines[i].replace(mark, '');
        i++;
        /* a wrapped line under an item belongs to it */
        while (i < lines.length && lines[i].trim() && /^\s{2,}\S/.test(lines[i]) && !BULLET.test(lines[i]) && !NUMBER.test(lines[i])) item += ' ' + lines[i++].trim();
        items.push(item);
      }
      const Tag = ordered ? 'ol' : 'ul';
      blocks.push(<Tag key={k++} className={ordered ? 'minds-ol' : 'minds-ul'}>{items.map((it, j) => <li key={j}>{inline(it, 'l' + k + '-' + j)}</li>)}</Tag>);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^\s*```/.test(lines[i]) && !HEAD.test(lines[i]) && !BULLET.test(lines[i]) && !NUMBER.test(lines[i])) para.push(lines[i++].trim());
    blocks.push(<p key={k++}>{inline(para.join(' '), 'p' + k)}</p>);
  }
  return <>{blocks}</>;
}
