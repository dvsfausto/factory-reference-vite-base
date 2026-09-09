#!/usr/bin/env node
/**
 * ★★★ NO LITERAL COLOURS, NO RAW RHYTHM (2026-09-07). Every block reads the family tokens
 * (src/styles/app.css: text-fam-ink, bg-fam-surface-2, border-fam-hairline, bg-fam-accent …) and pads its
 * container with `py-section` / `py-band`. Before this, 644 emerald-* utilities and 723 family hexes were
 * baked into the blocks and a re-point layer in the scaffolder rewrote them per site; a block written with
 * a hardcoded colour slipped through it. This check fails the build on:
 *   - any emerald-* utility (the old accent ramp)
 *   - any arbitrary hex colour utility (bg-[#…], text-[#…], border-[#…], divide-[#…], from/to/via-[#…] …)
 *     that is not in the allowlist below
 *   - a raw `py-N md:py-M` pair on a `container-x` line (the section rhythm is the token)
 * ALLOWLIST — the dark-statement surfaces are component-owned literals on purpose (the elegant hero and
 * header's near-black, the corporate navy band, on-dark text): the niche arc defines a --fam-dark /
 * --fam-on-dark pair per niche and retires these. Each entry names the file and the hex it may carry.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../src/', import.meta.url).pathname;
// Stage 6 (2026-09-09): the allowlist is EMPTY. The elegant/corporate dark-statement literals became the
// --fam-statement / --fam-on-statement set, the comparison-table and corporate greys became fam-line-2/-3 and
// fam-surface-3/-4/-5, the quote select's border fam-line-3. Every colour a component paints is a token.
const ALLOW = {};
const files = [];
(function walk(d) { for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p); else if (/\.tsx?$/.test(n)) files.push(p); } })(ROOT);

const problems = [];
for (const f of files) {
  const rel = relative(ROOT, f);
  const allow = new Set((ALLOW[rel] ?? []).map((h) => h.toUpperCase()));
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
    for (const m of code.matchAll(/(?<![\w-])[a-z-]*emerald-\d+(?:\/\d+)?/g)) problems.push(`${rel}:${i + 1}  ${m[0]}  (emerald ramp → use fam-accent*)`);
    for (const m of code.matchAll(/[a-z:-]*\[(#[0-9A-Fa-f]{3,8})(?:\/\d+)?\]/g)) if (!allow.has(m[1].toUpperCase())) problems.push(`${rel}:${i + 1}  ${m[0]}  (literal colour → use a fam-* token)`);
    if (/container-x/.test(code) && /\bpy-\d+(?:\.\d+)?\s[^"'`]*\b(?:sm|md|lg):py-\d+/.test(code)) problems.push(`${rel}:${i + 1}  raw padding pair on a container (→ py-section / py-band)`);
  });
}
if (problems.length) { console.error(`✗ ${problems.length} literal colour / raw rhythm use(s):\n  ` + problems.join('\n  ')); process.exit(1); }
console.log(`✓ no literal colours, no raw rhythm (${files.length} files)`);
