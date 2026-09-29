// ★ THE COPY ON A PAGE WE BUILD IS DESIGNED, NOT DUMPED (the owner, 2026-09-29: two pages showed "**What to expect:**" and
// "- High-energy cycling" with the asterisks and dashes as text). The assistant writes a small Markdown: headings (## / ###),
// bullet lists (- or *), **bold**, *italic*, paragraphs on blank lines. This parser turns that into blocks the RichTextBlock
// renders with the site's own type and tokens. Pure, no React, no HTML pass-through (a tag in the copy stays text).
export type Run = { text: string; bold?: boolean; italic?: boolean }
export type RichBlock =
  | { kind: 'heading'; level: 2 | 3; runs: Run[] }
  | { kind: 'paragraph'; runs: Run[] }
  | { kind: 'list'; items: Run[][] }

/** inline **bold** and *italic* (and _italic_) into runs; unmatched markers stay as text */
export function parseRuns(text: string): Run[] {
  const runs: Run[] = []
  const re = /\*\*([^*]+)\*\*|\*([^*\n]+)\*|_([^_\n]+)_/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) runs.push({ text: text.slice(last, m.index) })
    if (m[1] !== undefined) runs.push({ text: m[1], bold: true })
    else runs.push({ text: (m[2] ?? m[3])!, italic: true })
    last = m.index + m[0].length
  }
  if (last < text.length) runs.push({ text: text.slice(last) })
  return runs.filter((r) => r.text.length > 0)
}

/** a block of copy → headings, paragraphs and lists; a list line is "- " or "* " or "• "; a heading line is "## " or "### " */
export function parseRichText(body: string): RichBlock[] {
  const out: RichBlock[] = []
  const chunks = (body ?? '').replace(/\r\n/g, '\n').split(/\n{2,}/).map((c) => c.trim()).filter(Boolean)
  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean)
    let para: string[] = []
    let items: Run[][] = []
    const flushPara = () => { if (para.length) { out.push({ kind: 'paragraph', runs: parseRuns(para.join('\n')) }); para = [] } }
    const flushList = () => { if (items.length) { out.push({ kind: 'list', items }); items = [] } }
    for (const line of lines) {
      const h = line.match(/^(#{2,3})\s+(.+)$/)
      const li = line.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/)
      if (h) { flushPara(); flushList(); out.push({ kind: 'heading', level: h[1]!.length === 2 ? 2 : 3, runs: parseRuns(h[2]!) }); continue }
      if (li) { flushPara(); items.push(parseRuns(li[1]!)); continue }
      // a bold-only line on its own ("**What to expect:**") is a small heading, not a paragraph
      const boldLine = line.match(/^\*\*([^*]+)\*\*:?$/)
      if (boldLine) { flushPara(); flushList(); out.push({ kind: 'heading', level: 3, runs: [{ text: boldLine[1]!.replace(/:$/, '') }] }); continue }
      flushList(); para.push(line)
    }
    flushPara(); flushList()
  }
  return out
}

/** the copy as plain words (for meta descriptions and read-backs): markers removed */
export function plainText(body: string): string {
  return parseRichText(body).map((b) => (b.kind === 'list' ? b.items.map((i) => i.map((r) => r.text).join('')).join('. ') : b.runs.map((r) => r.text).join(''))).join(' ').replace(/\s+/g, ' ').trim()
}
