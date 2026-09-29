#!/usr/bin/env node
// check-paragraphs — every service body renders through paragraphs() (blank lines = paragraphs), never one <p> (2026-09-29).
import { readFileSync } from 'node:fs'
const fails = []
for (const f of ['src/components/blocks/ServiceDetailsBlock.tsx', 'src/components/blocks/ServiceWhatWeCoverBlock.tsx']) {
  const s = readFileSync(f, 'utf8')
  for (const field of ['howPrice.body', 'pricing.body', 'scenarios.intro', 'coverage.intro', 'whatWeBuy.body']) {
    if (s.includes(`>{${field}}</p>`)) fails.push(`${f}: ${field} is rendered as one <p>; use paragraphs(${field})`)
  }
}
const lib = readFileSync('src/lib/paragraphs.ts', 'utf8')
if (!/split\(\/\\n\{2,\}\/\)/.test(lib)) fails.push('paragraphs() must split on blank lines')
if (fails.length) { console.error('check-paragraphs:\n  ' + fails.join('\n  ')); process.exit(1) }
console.log('check-paragraphs: ok')
