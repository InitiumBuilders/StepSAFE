/* The oldest browser StepSAFE is built for: Safari 15.4 and later (iOS 15.4, March 2022). Its styles already use svh
   units and :has(), which arrived in that version, so the build targets it too (2026-11-23).
   Vite 8 targets Safari 16.4 unless told otherwise. From that target its CSS minifier writes min-width and max-width
   media queries in range form, (width>=900px), and Safari before 16.4 skips them: on those phones no phone rule
   applies. This site is on Vite 6, which builds for Safari 14 and keeps min-width and max-width queries as they are.
   The target and the check keep it that way through an upgrade.
   Safari before 16 can throw on some class field initializers (WebKit bug 236843). At this target esbuild writes class
   fields as they are, so LOWER tells it to write them as constructor code.
   The check fails any build whose output Safari 15.4 cannot read or run: a media query in range form, a regex
   lookbehind or v flag, a class static block, or a class field. To check a finished build:
   node scripts/floor.mjs dist/assets */
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAst } from 'vite';

export const FLOOR = ['chrome111', 'edge111', 'firefox114', 'safari15.4', 'ios15.4'];

/* class fields as constructor code (WebKit bug 236843, above), given to esbuild as esbuild.supported */
export const LOWER = { 'class-field': false, 'class-static-field': false, 'class-private-field': false, 'class-private-static-field': false };

const text = (source) => (typeof source === 'string' ? source : new TextDecoder().decode(source));

function jsFaults(code, name) {
  const faults = [];
  /* At this target the transpiler lowers static blocks and writes a lookbehind or v-flag regex as new RegExp("..."),
     so a chunk can hold a fault only if one of these appears in its text, or a class. Parsing only those chunks keeps
     the build fast. */
  if (!/\(\?<|static ?\{|RegExp\(|class[\s{]/.test(code)) return faults;
  const regex = (pattern, flags) => {
    if (/\(\?<[=!]/.test(pattern)) faults.push(`${name}: a regex lookbehind (Safari 16.4): /${pattern.slice(0, 70)}/`);
    if (flags.includes('v')) faults.push(`${name}: a regex v flag (Safari 17): /${pattern.slice(0, 70)}/`);
  };
  const stack = [parseAst(code)];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== 'object') continue;
    if (Array.isArray(node)) { stack.push(...node); continue; }
    if (node.type === 'StaticBlock') faults.push(`${name}: a class static block (Safari 16.4)`);
    if (node.type === 'PropertyDefinition') faults.push(`${name}: a class field (Safari 16, WebKit bug 236843)`);
    if (node.type === 'Literal' && node.regex) regex(node.regex.pattern, node.regex.flags);
    /* A regex the transpiler could not lower becomes new RegExp("..."), which parses but throws when it runs. */
    if ((node.type === 'NewExpression' || node.type === 'CallExpression') && node.callee?.type === 'Identifier' && node.callee.name === 'RegExp' && typeof node.arguments?.[0]?.value === 'string')
      regex(node.arguments[0].value, typeof node.arguments[1]?.value === 'string' ? node.arguments[1].value : '');
    for (const key in node) if (key !== 'type' && key !== 'start' && key !== 'end' && node[key] && typeof node[key] === 'object') stack.push(node[key]);
  }
  return faults;
}

function cssFaults(css, name) {
  const faults = [];
  for (const [query] of css.matchAll(/@media[^{]*/g))
    if (/\([^)]*[<>]/.test(query)) faults.push(`${name}: a media query in range form (Safari 16.4): ${query.slice(0, 70)}`);
  return faults;
}

/* Every fault in a folder of built files, for checking a build made elsewhere. */
export async function faultsIn(dir) {
  const { readdir, readFile } = await import('node:fs/promises');
  const { join } = await import('node:path');
  const faults = [];
  for (const file of await readdir(dir)) {
    if (file.endsWith('.js')) faults.push(...jsFaults(await readFile(join(dir, file), 'utf8'), file));
    else if (file.endsWith('.css')) faults.push(...cssFaults(await readFile(join(dir, file), 'utf8'), file));
  }
  return faults;
}

export function floor() {
  return {
    name: 'safari-floor',
    apply: 'build',
    writeBundle(_, bundle) {
      const faults = [];
      for (const file of Object.values(bundle)) {
        if (file.type === 'chunk') faults.push(...jsFaults(file.code, file.fileName));
        else if (file.fileName.endsWith('.css')) faults.push(...cssFaults(text(file.source), file.fileName));
      }
      const more = faults.length > 30 ? `\n...and ${faults.length - 30} more` : '';
      if (faults.length) this.error(`Safari 15.4 cannot read or run this build (scripts/floor.mjs):\n${faults.slice(0, 30).join('\n')}${more}`);
    },
  };
}

/* node scripts/floor.mjs <folder of built files> */
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) { console.error('usage: node scripts/floor.mjs dist/assets'); process.exit(2); }
  const faults = await faultsIn(dir);
  console.log(faults.length ? faults.join('\n') : 'Safari 15.4 can read and run every file.');
  process.exit(faults.length ? 1 : 0);
}
