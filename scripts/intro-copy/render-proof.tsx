/**
 * ★ THE ABOUT PAGE'S PROSE IS DESIGNED COPY (ZB-241, 2026-10-11). An owner's About, written through the assistant as a small
 * Markdown, reached the site as typed: "**Inside Experience**", "- Career clarity", "[Book a call](https://…)" in one <p>.
 * IntroBlock (the shared page intro the About route renders through) now draws that copy with the rich-text parser: bold lines
 * become headings, dashes become a list, a link becomes a link, blank lines become paragraphs. Plain copy stays one paragraph.
 *
 *   npm run test:intro-copy
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { IntroBlock } from '~/components/blocks/IntroBlock'

let failed = 0
const check = (name: string, ok: boolean, detail = '') => { console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`); if (!ok) failed++ }

const ABOUT = `Jo Example is a coach with fifteen years in talent development.

**Inside Experience. Real Insight.**

Her approach is grounded in firsthand knowledge of how organizations work.

**How She Works With You**

Depending on your goals, the work may focus on:
- Career clarity and direction
- Leadership growth
- Behavioral insight

You do not have to figure everything out on your own. [Book a Complimentary Discovery Call](https://calendly.com/example/30min)`

const html = renderToStaticMarkup(createElement(IntroBlock, { eyebrow: 'About', heading: 'About Example Coaching', body: ABOUT }))
check('no asterisk, dash marker or bracket reaches the page', !/\*\*|\[Book|\]\(https?:|(^|>)- /.test(html.replace(/<[^>]+>/g, '\n')), html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 160))
check('a bold-only line is a heading', /<h3[^>]*>(?:<span>)?Inside Experience\. Real Insight\.(?:<\/span>)?<\/h3>/.test(html) && /<h3[^>]*>(?:<span>)?How She Works With You(?:<\/span>)?<\/h3>/.test(html), html.match(/<h3[^>]*>.{0,60}/)?.[0])
check('the dashes are a list of three', (html.match(/<li/g) ?? []).length === 3 && html.includes('Career clarity and direction'))
check('the link is a link', /<a [^>]*href="https:\/\/calendly\.com\/example\/30min"[^>]*>Book a Complimentary Discovery Call<\/a>/.test(html))
check('blank lines are paragraphs', (html.match(/<p/g) ?? []).length >= 3)

const plain = renderToStaticMarkup(createElement(IntroBlock, { heading: 'Pricing', body: 'Simple, honest pricing for every job.' }))
check('plain copy stays one paragraph', (plain.match(/<p/g) ?? []).length === 1 && plain.includes('Simple, honest pricing for every job.') && !plain.includes('<li') && !plain.includes('<h3'))
const empty = renderToStaticMarkup(createElement(IntroBlock, { heading: 'Pricing', body: '' }))
check('an empty body draws no paragraph', !empty.includes('<p'))

console.log(failed ? `\n${failed} failed` : '\nintro-copy render proof: ok')
process.exit(failed ? 1 : 0)
