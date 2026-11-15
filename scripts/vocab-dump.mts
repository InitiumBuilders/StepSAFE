/* Writes research/outlier/vocab.txt: the part kinds, sector tags and pressures a map can carry, from the app itself. */
import { writeFileSync } from 'node:fs';
import * as own from '../src/content/modux/own';
import { PRESSURES } from '../src/content/modux/pressures';
const out: string[] = [];
out.push('PART KINDS (kind | what it means)');
for (const k of ['people', 'public', 'identity', 'network', 'data', 'build', 'money', 'control', 'model', 'time', 'vendor']) out.push(k + ' | ' + ((own as any).KIND_HINT?.[k] || ''));
out.push('', 'SECTOR TAGS (tag | label)');
for (const t of own.TAG_CHOICES as any[]) out.push(t.tag + ' | ' + t.label);
out.push('', 'PRESSURES A MAP CAN CARRY (id | name | hits part kind | fits sector tags, empty = any)');
for (const p of PRESSURES as any[]) if (!p.open && !String(p.id).startsWith('pr-open-')) out.push(p.id + ' | ' + p.name + ' | hits ' + p.target + ' | fits ' + (p.fits ? p.fits.join(',') : 'any'));
out.push('', 'LIMITS: at most ' + own.MAX_PARTS + ' parts; ' + own.MIN_THREATS + ' to ' + own.MAX_THREATS + ' threats; a threat fits only if the map has a part of the kind it hits and, when it lists sector tags, the entry carries one of them.');
writeFileSync('research/outlier/vocab.txt', out.join('\n') + '\n');
console.log('vocab.txt: ' + out.length + ' lines');
