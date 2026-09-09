// lint:decor (2026-09-09, permanent) — a decoration comes from the family or the vertical, or it does not exist.
// A cleaning company's leaf motif sat on an accountant's footer because six SHARED components carried it as a
// hardcoded default. Rules: (1) the only importer of src/assets/decorative/* is src/lib/decor.ts; (2) no component
// defaults a decoration prop to an asset (`decorativeAsset = <identifier>` other than siteDecor()); (3) every
// <img … aria-hidden> whose src is a variable must be guarded by that variable being defined.
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
const ROOT = path.resolve(new URL("..", import.meta.url).pathname, "src");
const files = [];
const walk = (d) => { for (const f of readdirSync(d)) { const p = path.join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.(tsx?|jsx?)$/.test(f)) files.push(p); } };
walk(ROOT);
const problems = [];
for (const f of files) {
  const rel = path.relative(ROOT, f); const src = readFileSync(f, "utf8");
  if (/assets\/decorative\//.test(src) && rel !== "lib/decor.ts") problems.push(`${rel}: imports a decorative asset directly (only src/lib/decor.ts may)`);
  for (const m of src.matchAll(/decorativeAsset\s*=\s*([A-Za-z_$][\w$]*)\s*[,}]/g)) if (m[1] !== "siteDecor") problems.push(`${rel}: decoration prop defaults to "${m[1]}" — must be siteDecor()`);
  for (const m of src.matchAll(/<img\s+src=\{(\w+)\}[^>]*aria-hidden[^>]*\/>/g)) {
    const before = src.slice(Math.max(0, m.index - 240), m.index);
    if (!new RegExp(`\\{\\s*${m[1]}\\s*&&\\s*\\(?\\s*$`).test(before)) problems.push(`${rel}: <img src={${m[1]}} aria-hidden> is not guarded by {${m[1]} && …}`);
  }
}
if (problems.length) { console.error(`lint:decor — ${problems.length} problem(s):\n  ${problems.join("\n  ")}`); process.exit(1); }
console.log(`✓ lint:decor — ${files.length} files: decorative assets only via src/lib/decor.ts, no shared default, every decorative <img> guarded`);
