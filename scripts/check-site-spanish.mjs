#!/usr/bin/env node
// ★★★ A SPANISH SITE MUST BE SPANISH THROUGHOUT (the owner, 2026-09-24): a customer-facing sentence the template
// itself writes (not the generated copy) must go through tr() so it renders in the site's language. This gate
// walks the real syntax tree and fails the build on any raw English a customer could see:
//   · JSX text ("Get started", "Scroll for more →")
//   · a string handed to placeholder / label / aria-label / title / alt / description
//   · a string default on a component prop (heading = 'Simple, transparent pricing')
//   · a string on title / heading / eyebrow / body / label / ctaLabel in src/data layouts
// Proper nouns and non-words live in scripts/site-spanish-allow.json. Baseline is ZERO. Usage: node scripts/check-site-spanish.mjs [--list]
import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const ROOT = path.resolve(new URL('..', import.meta.url).pathname)
const SRC = path.join(ROOT, 'src')
const allow = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/site-spanish-allow.json'), 'utf8')))
const ATTRS = new Set(['placeholder', 'label', 'aria-label', 'title', 'alt', 'description'])
const DATA_KEYS = new Set(['title', 'heading', 'eyebrow', 'body', 'label', 'ctaLabel', 'subheading', 'subtitle', 'cta', 'caption', 'note'])
const PROP_DEFAULTS = new Set(['heading', 'eyebrow', 'body', 'subheading', 'ctaLabel', 'cta', 'label', 'title', 'caption', 'note', 'sublabel', 'submitLabel', 'buttonLabel', 'intro', 'description', 'emptyText', 'placeholder'])

const files = []
;(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) { if (!p.includes(`${path.sep}components${path.sep}ui`)) walk(p) }
    else if (/\.(tsx|ts)$/.test(p) && !/\.(test|spec|d)\.tsx?$/.test(p)) files.push(p)
  }
})(SRC)

// English a customer would read: has a letter, at least one lowercase vowel word, is not a code-ish token.
function looksLikeWords(s) {
  const t = s.replace(/&[a-z]+;|&#\d+;/g, '').replace(/\s+/g, ' ').trim()
  if (t.length < 2) return false
  if (allow.has(t)) return false
  if (!/[A-Za-z]{2,}/.test(t)) return false
  if (/^[A-Z0-9_./:-]+$/.test(t)) return false // CONSTANT, path
  if (/^[a-z0-9]+([-_.:/][a-z0-9]+)+$/.test(t)) return false // slug-like, class-like
  if (/^(https?:|mailto:|tel:|\/)/.test(t)) return false
  if (/^[a-z]+$/.test(t) && t.length < 4) return false
  if (!/[A-Z]/.test(t) && !/ /.test(t)) return false // 'text', 'viewport', 'en-US': a token, not a sentence
  if (/^[a-z0-9\-\[\]():#,.%\/ ]+$/.test(t)) return false // a class list ('py-16 md:py-24')
  return true
}
const inTr = (node) => { for (let n = node.parent; n; n = n.parent) { if (ts.isCallExpression(n) && n.expression.getText() === 'tr') return true } return false }

const hits = []
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8')
  const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true, f.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  const rel = path.relative(ROOT, f)
  const isData = rel.startsWith('src/data/') && /-layout.ts$/.test(rel) // layouts a customer sees; the variant manifest is editor-facing
  const push = (node, kind, s) => { if (looksLikeWords(s)) hits.push({ file: rel, line: sf.getLineAndCharacterOfPosition(node.getStart()).line + 1, kind, text: s.replace(/\s+/g, ' ').trim() }) }
  ;(function visit(node) {
    if (ts.isJsxText(node)) push(node, 'jsx-text', node.text)
    else if (ts.isJsxExpression(node) && node.expression && ts.isStringLiteral(node.expression) && ts.isJsxElement(node.parent)) push(node, 'jsx-text', node.expression.text)
    else if (ts.isJsxAttribute(node) && ATTRS.has(node.name.getText()) && node.initializer) {
      if (ts.isStringLiteral(node.initializer)) push(node, `attr:${node.name.getText()}`, node.initializer.text)
      else if (ts.isJsxExpression(node.initializer) && node.initializer.expression && ts.isStringLiteral(node.initializer.expression)) push(node, `attr:${node.name.getText()}`, node.initializer.expression.text)
    }
    else if (ts.isBindingElement(node) && node.initializer && ts.isStringLiteral(node.initializer) && PROP_DEFAULTS.has((node.propertyName ?? node.name).getText())) push(node, `default:${(node.propertyName ?? node.name).getText()}`, node.initializer.text)
    else if (isData && ts.isPropertyAssignment(node) && ts.isStringLiteral(node.initializer) && DATA_KEYS.has(node.name.getText())) push(node, `data:${node.name.getText()}`, node.initializer.text)
    else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken && ts.isStringLiteral(node.right) && !inTr(node)) push(node.right, 'fallback', node.right.text) // `x ?? 'Ready when you are.'` = the words a site with no copy shows
    else if (rel.startsWith('src/routes/') && ts.isPropertyAssignment(node) && ts.isStringLiteral(node.initializer) && (DATA_KEYS.has(node.name.getText()) || node.name.getText() === 'name') && !inTr(node)) push(node, `route:${node.name.getText()}`, node.initializer.text)
    ts.forEachChild(node, visit)
  })(sf)
}
const real = hits.filter((h) => !inTrFile(h))
function inTrFile() { return false }
if (process.argv.includes('--json')) { console.log(JSON.stringify(real)); process.exit(real.length ? 1 : 0) }
if (real.length) {
  console.error(`check-site-spanish: ${real.length} customer-facing string(s) outside tr() — a Spanish site would show them in English:`)
  for (const h of real) console.error(`  ${h.file}:${h.line}  [${h.kind}]  ${JSON.stringify(h.text.slice(0, 90))}`)
  console.error('Wrap each in tr(\'section.key\') with an EN and an ES entry in src/lib/i18n.ts, or, for a proper noun, add it to scripts/site-spanish-allow.json.')
  process.exit(1)
}
console.log(`check-site-spanish: 0 customer-facing strings outside tr() across ${files.length} files`)
