import { PROJECTS, type GalleryItem } from '~/data/projects'

/**
 * ★ THE SHOWCASE LOOK'S SHARED RULES (2026-10-29).
 * GOLD WORD: in every Showcase headline a word (or words) wrapped in *asterisks* is set in gold; with no asterisks the LAST
 * word is gold. The asterisks never reach the page: the visible text, aria and title read the plain words.
 * PIECES: the gallery items (PROJECTS) are sorted by their category. 'collage' feeds the scattered cutouts, 'signature' the
 * signature trio; every other item is a piece in the grid. The name is the caption's first line (else the title).
 */
export type GoldPart = { text: string; gold: boolean }

export function goldParts(raw: string | undefined | null): GoldPart[] {
  const t = (raw ?? '').trim()
  if (!t) return []
  if (/\*[^*]+\*/.test(t)) {
    const out: GoldPart[] = []
    for (const [i, seg] of t.split(/\*([^*]+)\*/).entries()) {
      if (seg) out.push({ text: seg, gold: i % 2 === 1 })
    }
    return out
  }
  const m = t.match(/^(.*\s)?(\S+)$/s)
  if (!m || !m[1]) return [{ text: t, gold: true }]
  return [{ text: m[1], gold: false }, { text: m[2]!, gold: true }]
}

/** The words without the asterisks (aria, title, alt). */
export function plainText(raw: string | undefined | null): string {
  return (raw ?? '').replace(/\*([^*]+)\*/g, '$1').trim()
}

const cat = (p: GalleryItem) => (p.category ?? '').trim().toLowerCase()
export function piecesIn(category: string, projects: GalleryItem[] = PROJECTS): GalleryItem[] {
  return projects.filter((p) => p.image && cat(p) === category)
}
/** The pieces of the grid: every item that is neither a collage cutout nor a signature piece. */
export function gridPieces(projects: GalleryItem[] = PROJECTS): GalleryItem[] {
  return projects.filter((p) => p.image && cat(p) !== 'collage' && cat(p) !== 'signature')
}

/** The name and the one line of a piece: the caption's first line is the name, the next line the one-liner (12 words at most). */
export function pieceText(p: GalleryItem): { name: string; line: string } {
  const lines = (p.caption ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return { name: (p.title ?? '').trim(), line: '' }
  const words = (lines[1] ?? '').split(/\s+/).filter(Boolean)
  const line = words.length > 12 ? `${words.slice(0, 12).join(' ')}…` : words.join(' ')
  return { name: lines[0]!, line }
}

/** An owner button link the factory passes through (https only); anything else falls back. */
export function httpsOr(href: unknown, fallback: string): string {
  return typeof href === 'string' && /^https:\/\/\S+$/i.test(href) ? href : fallback
}
