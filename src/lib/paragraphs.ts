// ★ A BODY WITH BLANK LINES IS SEVERAL PARAGRAPHS (the owner, 2026-09-29: a photographer asked five times for her 2,500-character
// service overview to be split; the template rendered every service body in ONE paragraph element, so a split text would
// still have read as a wall). Split on blank lines; single newlines stay inside a paragraph. Pure.
export function paragraphs(body: string | null | undefined): string[] {
  return (body ?? '').replace(/\r\n/g, '\n').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
}
