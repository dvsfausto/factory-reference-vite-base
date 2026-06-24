#!/usr/bin/env node
// Honesty floor — the base skin must assert NO credential by DEFAULT. Component
// default props (trustItems/items) and the site.ts seed ship verbatim into every
// scaffolded site and render whenever the build doesn't override them. A hardcoded
// "Licensed & insured" / "Accredited" / "Established 1998" / "500+ clients" therefore
// asserts, as fact, a credential the business may never have claimed. This lint
// fails if any such assertion appears in a default.
//
// It flags ASSERTIONS, not honest QUESTIONS: an FAQ "Are you licensed and insured?"
// is fine; the answer must not claim "fully insured and bonded".
//
// Usage:  node scripts/check-no-credential-claims.mjs [rootDir]
// Scans <root>/src/components/**/*.tsx and <root>/src/data/site.ts.

import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), '..')

// Each pattern matches a credential / invented-fact ASSERTION (not a question).
const PATTERNS = [
  { id: 'licensed-&-credential', re: /licen[sc]ed\s*&\s*(insured|accredited|bonded)/i },
  { id: 'fully-licensed/insured/bonded', re: /\bfully\s+(insured|licensed|bonded|accredited)/i },
  { id: 'standalone-bonded-badge', re: /(['"`])\s*bonded\s*\1/i },
  { id: 'proper-credentials', re: /proper credentials/i },
  { id: 'credentials-to-back', re: /credentials to back/i },
  { id: 'background-checked', re: /background[\s-]?checked/i },
  { id: 'accredited-in-good-standing', re: /accredited\s*&\s*in good standing/i },
  { id: 'established-year', re: /\bestablished\s+(18|19|20)\d{2}/i },
  { id: 'invented-client-count', re: /\b\d{2,}\+\s*(clients|customers|projects|families|homes)\b/i },
  { id: 'award-winning', re: /award[\s-]?winning/i },
  { id: 'most-insurance-accepted', re: /most insurance accepted/i },
]

function collectFiles() {
  const files = []
  const blocksRoot = join(root, 'src', 'components')
  const walk = (dir) => {
    if (!existsSync(dir)) return
    for (const name of readdirSync(dir)) {
      const p = join(dir, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (name.endsWith('.tsx')) files.push(p)
    }
  }
  walk(blocksRoot)
  const siteSeed = join(root, 'src', 'data', 'site.ts')
  if (existsSync(siteSeed)) files.push(siteSeed)
  return files
}

const offenders = []
for (const file of collectFiles()) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    // Skip honest FAQ questions (interrogative) — only answers/badges assert.
    const isQuestion = /question:/.test(line) || /\?\s*['"`,]?\s*$/.test(line.trim())
    for (const p of PATTERNS) {
      if (p.re.test(line) && !(isQuestion && p.id === 'licensed-&-credential')) {
        offenders.push({ file: file.replace(root + '/', ''), line: i + 1, id: p.id, text: line.trim().slice(0, 90) })
      }
    }
  })
}

console.log(`honesty floor — credential-class assertions in base-skin defaults (root: ${root})`)
if (offenders.length) {
  console.error(`\n✗ ${offenders.length} credential-asserting default(s) found — these render as fact on every site:`)
  for (const o of offenders) console.error(`    ${o.file}:${o.line}  [${o.id}]  ${o.text}`)
  console.error('\n  Fix: replace with a non-asserting value prop (the business may not hold the credential).')
  process.exit(1)
}
console.log('  ✓ no credential-class assertion in any base-skin default')
process.exit(0)
