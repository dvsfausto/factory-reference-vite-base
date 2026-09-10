// ONE MECHANICAL PASS (visual elevation Stage B, 2026-09-10): raw shadow / duration / ease / hover-kind classes → the
// role tokens declared in app.css. Exactly palette part two: rewrite, then the build fails on a raw class
// (scripts/check-raw-physics.mjs) and the gate is identity (test:elevation-identity at zero). Run once; idempotent.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const MAP = [
  // elevation at rest and on hover (the prefix — hover:, group-hover:, md: … — is kept verbatim)
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)shadow-xs(?=[\s"'`})]|$)/g, '$1elev-0'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)shadow-sm(?=[\s"'`})]|$)/g, '$1elev-1'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)shadow-md(?=[\s"'`})]|$)/g, '$1elev-2'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)shadow-lg(?=[\s"'`})]|$)/g, '$1elev-3'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)shadow-xl(?=[\s"'`})]|$)/g, '$1elev-4'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)shadow-2xl(?=[\s"'`})]|$)/g, '$1elev-5'],
  // durations and eases
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)duration-200(?=[\s"'`})]|$)/g, '$1duration-(--motion-fast)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)duration-300(?=[\s"'`})]|$)/g, '$1duration-(--motion-base)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)duration-500(?=[\s"'`})]|$)/g, '$1duration-(--motion-slow)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)duration-700(?=[\s"'`})]|$)/g, '$1duration-(--motion-slower)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)duration-1000(?=[\s"'`})]|$)/g, '$1duration-(--motion-slowest)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)ease-out(?=[\s"'`})]|$)/g, '$1ease-(--ease-standard)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)*)ease-in-out(?=[\s"'`})]|$)/g, '$1ease-(--ease-emphasis)'],
  // hover kinds: lift · zoom · fade · nudge
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)+)-translate-y-0\.5(?=[\s"'`})]|$)/g, '$1translate-y-(--hov-lift-sm)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)+)-translate-y-1\.5(?=[\s"'`})]|$)/g, '$1translate-y-(--hov-lift-lg)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)+)-translate-y-1(?=[\s"'`})]|$)/g, '$1translate-y-(--hov-lift)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)+)scale-105(?=[\s"'`})]|$)/g, '$1scale-(--hov-zoom)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)+)scale-\[1\.05\](?=[\s"'`})]|$)/g, '$1scale-(--hov-zoom)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)+)scale-\[1\.06\](?=[\s"'`})]|$)/g, '$1scale-(--hov-zoom-md)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)+)scale-110(?=[\s"'`})]|$)/g, '$1scale-(--hov-zoom-lg)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)+)scale-\[1\.02\](?=[\s"'`})]|$)/g, '$1scale-(--hov-zoom-xs)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)+)scale-\[1\.08\](?=[\s"'`})]|$)/g, '$1scale-(--hov-zoom-xl)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)+)opacity-90(?=[\s"'`})]|$)/g, '$1opacity-(--hov-fade)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)+)translate-x-0\.5(?=[\s"'`})]|$)/g, '$1translate-x-(--hov-nudge-sm)'],
  [/(?<=^|[\s"'`{(:])((?:[a-z-]+:)+)translate-x-1(?=[\s"'`})]|$)/g, '$1translate-x-(--hov-nudge)'],
];
const SKIP = /\/src\/components\/ui\//; // the shadcn kit — not imported by the site
let files = 0, edits = 0; const perRule = MAP.map(() => 0);
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.tsx?$/.test(f) && !SKIP.test(p)) { const src = readFileSync(p, 'utf8'); let out = src; MAP.forEach(([re, to], i) => { out = out.replace(re, (...m) => { perRule[i]++; return m[0].replace(re, to); }); }); if (out !== src) { writeFileSync(p, out); files++; edits += MAP.reduce((a, _, i) => a + perRule[i], 0); } } } };
walk(join(process.cwd(), 'src'));
console.log(`tokenise-physics: ${files} files rewritten; per rule: ${perRule.join(' ')}`);
