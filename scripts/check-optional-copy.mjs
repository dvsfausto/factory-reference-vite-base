#!/usr/bin/env node
// check-optional-copy — copy an owner may CLEAR draws nothing when it is empty (the owner, 2026-09-21).
//
// Asked to remove the hero kicker, an owner was told it "needs some text"; the workaround was a single space, and
// the eyebrow's accent line kept drawing around nothing. The editor now accepts a clear on eight fields (editor-api
// src/lib/site-fields.ts, `clearable: true`); this check makes the template honour it BY CONSTRUCTION: every JSX
// use of one of those fields must sit under `hasText(x) && …` or `hasText(x) ? … : …` on that same value, so the
// element that holds it — the pill, the accent line, the paragraph — goes with it.
//
// It reads the AST, not text, because blocks alias the fields through props: `kicker = site.hero.kicker` in the
// parameter list makes `{kicker}` the hero kicker. Runs in the build chain; fails on the first unguarded use.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'

// the SITE paths of the eight clearable fields (editor path → where the site data keeps it)
const FIELDS = ['hero.kicker', 'hero.subheadline', 'hero.body', 'tagline', 'homeServices.body', 'homeCta.subtitle', 'homeAreas.body', 'story.attribution']

const files = []
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? walk(p) : /\.tsx$/.test(n) && files.push(p) } }
walk(process.argv[2] ?? 'src')

/** `site.hero.kicker` / `SITE.hero.kicker` / `site?.hero?.kicker` → 'hero.kicker'; anything else → null */
const fieldOf = (node) => {
  const parts = []
  let n = node
  while (n && (ts.isPropertyAccessExpression(n) || ts.isPropertyAccessChain?.(n))) { parts.unshift(n.name.text); n = n.expression }
  if (!n || !ts.isIdentifier(n) || !/^(site|SITE)$/.test(n.text)) return null
  const path = parts.join('.')
  return FIELDS.includes(path) ? path : null
}
const textOf = (sf, n) => n.getText(sf).replace(/\s+/g, '').replace(/\?\./g, '.')

const bad = []
let uses = 0
for (const f of files) {
  const src = readFileSync(f, 'utf8')
  if (!FIELDS.some((p) => src.includes(p.split('.').pop()))) continue
  const sf = ts.createSourceFile(f, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

  /* aliases: a destructured parameter whose default is a clearable field (`kicker = site.hero.kicker`) */
  const aliases = new Map() // identifier text → field
  const collect = (n) => {
    if (ts.isBindingElement(n) && n.initializer && ts.isIdentifier(n.name)) { const fp = fieldOf(n.initializer); if (fp) aliases.set(n.name.text, fp) }
    if (ts.isVariableDeclaration(n) && n.initializer && ts.isIdentifier(n.name)) { const fp = fieldOf(n.initializer); if (fp) aliases.set(n.name.text, fp) }
    ts.forEachChild(n, collect)
  }
  collect(sf)

  const usedField = (expr) => fieldOf(expr) ?? (ts.isIdentifier(expr) ? aliases.get(expr.text) ?? null : null)

  /* guarded = some ancestor is `hasText(x) && …` or `hasText(x) ? … : …` on this same value.
     ⚠️ A BARE `x &&` IS NOT A GUARD: " " is truthy, and the render proof caught HeroServiceBannerBlock drawing an
     empty paragraph behind `{body && …}` — a site built before the editor normalized copy can still hold a space. */
  const needle = (exprText) => `hasText(${exprText})`
  const guarded = (node, exprText) => {
    for (let p = node.parent; p && !ts.isSourceFile(p); p = p.parent) {
      if (ts.isBinaryExpression(p) && p.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken && textOf(sf, p.left).includes(needle(exprText))) return true
      if (ts.isConditionalExpression(p) && textOf(sf, p.condition).includes(needle(exprText))) return true
      if (ts.isFunctionLike(p)) return false
    }
    return false
  }

  const visit = (n) => {
    if (ts.isJsxExpression(n) && n.expression) {
      const fp = usedField(n.expression)
      if (fp) {
        uses++
        const t = textOf(sf, n.expression)
        if (!guarded(n, t)) bad.push(`${f}:${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1} ${fp} (${t}) is drawn without a guard`)
      }
    }
    ts.forEachChild(n, visit)
  }
  visit(sf)
}
if (bad.length) { console.error(`check-optional-copy FAILED — ${bad.length} of ${uses} uses draw even when the owner cleared the field:\n  ` + bad.join('\n  ')); process.exit(1) }
console.log(`check-optional-copy ok (${uses} uses of the ${FIELDS.length} clearable fields, all guarded)`)
