// check-rich-text — the small Markdown the assistant writes renders as designed copy, never as asterisks and dashes (2026-09-29).
import { parseRichText, parseRuns, plainText } from '../src/lib/rich-text'
let failed = 0
const check = (name: string, ok: boolean, detail = '') => { console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`); if (!ok) failed++ }
const RIDE = `Feel the beat. Push your limits. Ride together.\n\nOur Ride classes are instructor-led indoor cycling sessions designed for every fitness level.\n\n**What to expect:**\n- High-energy cycling to a curated playlist\n- Instructor-led intervals: sprints, climbs, and recovery\n- A community that shows up and pushes together\n\nNo experience needed, just clip in and ride.`
const b = parseRichText(RIDE)
check('five blocks: paragraph, paragraph, heading, list, paragraph', b.map((x) => x.kind).join(',') === 'paragraph,paragraph,heading,list,paragraph', b.map((x) => x.kind).join(','))
check('the bold-only line is a heading without its markers', b[2]!.kind === 'heading' && (b[2] as { runs: { text: string }[] }).runs[0]!.text === 'What to expect')
check('three list items without the dash', b[3]!.kind === 'list' && (b[3] as { items: unknown[] }).items.length === 3 && (b[3] as { items: { text: string }[][] }).items[0]![0]!.text.startsWith('High-energy'))
const runs = parseRuns('Come **as you are** and *leave stronger*.')
check('bold and italic runs', runs.some((r) => r.bold && r.text === 'as you are') && runs.some((r) => r.italic && r.text === 'leave stronger'))
check('no asterisk survives in the plain text', !/[*#]/.test(plainText(RIDE)) && !/^- /m.test(plainText(RIDE)), plainText(RIDE).slice(0, 80))
check('a lone asterisk stays text', parseRuns('5 * 3').map((r) => r.text).join('') === '5 * 3')
check('an HTML tag stays text (no pass-through)', parseRuns('<b>x</b>').map((r) => r.text).join('') === '<b>x</b>')
check('## and ### headings', parseRichText('## Big\n\n### Small').map((x) => (x as { level?: number }).level).join(',') === '2,3')
check('numbered lines are a list', parseRichText('1. one\n2. two')[0]!.kind === 'list')
check('empty body → no blocks', parseRichText('').length === 0)
console.log(failed ? `\n${failed} failed` : '\ncheck-rich-text: ok')
process.exit(failed ? 1 : 0)
