import { PROJECTS, type GalleryItem } from '~/data/projects'
import { imageSrc } from '~/lib/asset-url'
import { hasText } from '~/lib/has-text'

// Gallery VARIANT: 'showcase-pieces' (the Showcase theme, 2026-10-29). Large photos of the pieces, each with a NAME and
// ONE LINE. Convention: the caption's first line is the name and the next line the one-liner (cut to 12 words); a
// one-line caption is the name alone; no caption, the title is the name. Two columns from tablet up, one on a phone,
// generous gaps. An optional heading from the block's params. No photos: nothing.

/** The name and the one line of a piece, read from its caption (see the convention above). Exported for tests. */
export function pieceText(p: GalleryItem): { name: string; line: string } {
  const lines = (p.caption ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return { name: (p.title ?? '').trim(), line: '' }
  const words = (lines[1] ?? '').split(/\s+/).filter(Boolean)
  const line = words.length > 12 ? `${words.slice(0, 12).join(' ')}…` : words.join(' ')
  return { name: lines[0]!, line }
}

export function GalleryShowcasePiecesBlock({
  projects = PROJECTS,
  heading,
}: {
  projects?: typeof PROJECTS
  ownerBuilt?: boolean
  label?: string
  heading?: string
  body?: string
}) {
  const pieces = projects.filter((p) => hasText(p.image))
  if (pieces.length === 0) return null
  return (
    <section className="bg-fam-page">
      <div className="container-x py-section">
        {hasText(heading) && (
          <h2 className="mb-12 text-center font-display text-3xl font-normal tracking-[-0.01em] text-fam-ink md:mb-16 md:text-5xl">{heading}</h2>
        )}
        <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-16 p-0 md:grid-cols-2 lg:gap-x-12 lg:gap-y-20">
          {pieces.map((p, i) => {
            const { name, line } = pieceText(p)
            return (
              <li key={`${p.image}-${i}`}>
                <figure className="m-0">
                  <div className="aspect-[4/5] overflow-hidden bg-fam-surface-2">
                    <img src={imageSrc(p.image)} alt={p.alt ?? name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  {(hasText(name) || hasText(line)) && (
                    <figcaption className="mt-6 text-center">
                      {hasText(name) && <p className="font-display text-2xl font-normal tracking-[-0.01em] text-fam-ink md:text-[28px]">{name}</p>}
                      {hasText(line) && <p className="mx-auto mt-2 max-w-md font-sans text-sm leading-relaxed text-fam-ink-muted">{line}</p>}
                    </figcaption>
                  )}
                </figure>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
