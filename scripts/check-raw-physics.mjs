// Stage B guard (2026-09-10): no raw shadow / duration / ease / hover-kind class in a site component — every one
// reads a role token (app.css: --elev-*, --motion-*, --ease-*, --hov-*), so the family physics can set them and the
// elevation-identity gate can hold them. Rewrite with scripts/tokenise-physics.mjs.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const RAW = [
  [/(?<![\w-])((?:[a-z-]+:)*)shadow-(2xs|xs|sm|md|lg|xl|2xl)(?![\w-])/, 'shadow-<size> → shadow-(--elev-N)'],
  [/(?<![\w-])((?:[a-z-]+:)*)duration-\d+(?![\w-])/, 'duration-<ms> → duration-(--motion-*)'],
  [/(?<![\w-])((?:[a-z-]+:)*)ease-(out|in|in-out)(?![\w-])/, 'ease-<name> → ease-(--ease-*)'],
  [/(?<![\w-])(?:group-)?hover:-translate-y-[\d.]+(?![\w-])/, 'hover lift → translate-y-(--hov-lift*)'],
  [/(?<![\w-])(?:group-)?hover:scale-(1[01]\d|\[1\.\d+\])(?![\w-])/, 'hover zoom → scale-(--hov-zoom*)'],
  [/(?<![\w-])(?:group-)?hover:opacity-90(?![\w-])/, 'hover fade → opacity-(--hov-fade)'],
];
const SKIP = /\/src\/components\/ui\//;
const bad = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.tsx?$/.test(f) && !SKIP.test(p)) { const lines = readFileSync(p, 'utf8').split('\n'); lines.forEach((l, i) => { if (/^\s*(\/\/|\*)/.test(l)) return; for (const [re, why] of RAW) { const m = l.match(re); if (m) bad.push(`${p.replace(process.cwd() + '/', '')}:${i + 1}: ${m[0]}  (${why})`); } }); } } };
walk(join(process.cwd(), 'src'));
if (bad.length) { console.error(`check-raw-physics: ${bad.length} raw physics class(es):\n  ${bad.slice(0, 40).join('\n  ')}`); process.exit(1); }
console.log('✓ physics: no raw shadow / duration / ease / hover-kind class outside the token layer');
