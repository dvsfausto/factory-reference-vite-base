#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ★★★ THE SEAM GUARD. `name` IS DATA, `displayName` IS PRESENTATION — AND THEY MUST NOT SWAP.
 *
 * A ServiceRef carries both: `name` is the owner's exact wording (what a form submits and what the
 * catalog row holds) and `displayName` is the heading form. Forty files render a service name. The
 * predictable failure is not the transform being wrong — it is a later edit reaching for the wrong
 * field in one of those forty, and nothing noticing.
 *
 * ⚠️ THE DANGEROUS DIRECTION IS SPECIFIC. `displayName` reaching a form payload writes presentation
 * into a customer record: FormQuoteBlock posts `serviceName: selected?.name` into a persisted lead.
 * That is why RULE 1 and RULE 2 exist, and why they fail the build rather than warn.
 *
 * ★ AND AN EMPTY PARSE IS A FAILURE, not a pass. A check that silently matches nothing reports
 * success forever; every rule below asserts it actually found something to look at first.
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'src'
const files = []
;(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p)
    else if (p.endsWith('.tsx') || p.endsWith('.ts')) files.push(p)
  }
})(ROOT)

const errors = []
const note = (f, line, msg) => errors.push(`${f}:${line}  ${msg}`)

/* Surfaces that intentionally stay on `name`: a form's visible label should match what it submits,
   and a person's name is never title-cased. Listed here so the exemption is a decision on the
   record rather than an accident of which file someone happened to edit. */
const NAME_ONLY_FILES = new Set([
  'src/components/blocks/FormQuoteBlock.tsx',
  'src/components/blocks/BookingWizardBlock.tsx',
  'src/components/blocks/TeamSpotlightBlock.tsx',
])

let sawAlt = 0
let sawPayloadKey = 0
let sawDisplayRender = 0
let sawNameField = 0

for (const f of files) {
  const src = readFileSync(f, 'utf8')
  const lines = src.split('\n')

  lines.forEach((l, i) => {
    const n = i + 1

    // RULE 1 — displayName must never be alt text. Alt describes the image's subject, which is the
    // thing itself, not a heading treatment of it.
    if (/alt=\{[^}]*\.displayName\b/.test(l)) note(f, n, 'displayName used as alt text — alt must use `name`')
    if (/alt=\{[^}]*\.name\b/.test(l)) sawAlt++

    // RULE 2 — displayName must never be a submitted field. Anything shaped `someKey: x.displayName`
    // inside an object literal is a payload property, which is how presentation reaches a DB row.
    if (/^\s*\w+\s*:\s*[\w.?]*\.displayName\b/.test(l) && !/^\s*displayName\s*:/.test(l))
      note(f, n, 'displayName assigned to a payload field — submitted values must use `name`')
    if (/^\s*serviceName\s*:\s*[\w.?]*\.name\b/.test(l)) sawPayloadKey++

    // RULE 3 — a converted display surface must not slip back to `name` as JSX text. Anything of the
    // shape `>{s.name}<` or a bare `{s.name}` child in a non-exempt component is a regression.
    if (!NAME_ONLY_FILES.has(f) && /(^\s*|>)\{(s|lead|service|svc)\.name\}(\s*$|<)/.test(l))
      note(f, n, 'service name rendered as visible text — headings must use `displayName`')

    if (/\{(s|lead|service|svc)\.displayName\}/.test(l)) sawDisplayRender++
    if (/^\s*displayName:\s*/.test(l)) sawNameField++
  })
}

/* ★ THE CONTROLS. Each rule must have had something in range, or its silence means nothing. */
const empty = []
if (sawAlt === 0) empty.push('RULE 1 found no `alt={….name}` at all — the alt convention moved, so the rule no longer covers anything')
if (sawPayloadKey === 0) empty.push('RULE 2 found no `serviceName: ….name` payload — the form payload moved, so the rule no longer covers anything')
if (sawDisplayRender === 0) empty.push('RULE 3 found no `{….displayName}` render — the display seam is gone, so nothing is being guarded')
if (sawNameField === 0) empty.push('no `displayName:` field is constructed anywhere — the type changed out from under this check')

if (empty.length) {
  console.error('✗ display-name seam check is not looking at anything:\n  ' + empty.join('\n  '))
  process.exit(1)
}

if (errors.length) {
  console.error(`✗ display-name seam violations (${errors.length}):\n  ` + errors.join('\n  '))
  process.exit(1)
}

console.log(
  `✓ display-name seam intact — ${sawDisplayRender} heading render(s) on displayName, ` +
    `${sawAlt} alt attribute(s) on name, ${NAME_ONLY_FILES.size} form/person surface(s) exempt.`,
)
