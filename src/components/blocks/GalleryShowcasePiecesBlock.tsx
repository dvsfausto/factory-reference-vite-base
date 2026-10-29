import { PROJECTS } from '~/data/projects'
import { tr } from '~/lib/i18n'
import { imageSrc } from '~/lib/asset-url'
import { hasText } from '~/lib/has-text'
import { gridPieces, pieceText } from '~/lib/showcase'
import { GoldHeading, Chip, CAPS } from '~/components/showcase/Primitives'

// Gallery VARIANT: 'showcase-pieces' (the Showcase theme, 2026-10-29). Anchored at #pieces. Large photos of the pieces in three
// columns (two on a tablet, one on a phone), each framed by a hairline, the NAME under it in spaced capitals and a small gold
// line under that: params.subtitle, else "Custom · One of One". No prices. The pieces are the gallery items whose category is
// neither 'collage' nor 'signature' (those feed their own sections). A gold chip from params.eyebrow and a headline from
// params.heading (the gold-word rule), both optional. No pieces: nothing.
export { pieceText }

export function GalleryShowcasePiecesBlock({
  projects = PROJECTS,
  heading,
  eyebrow,
  subtitle,
}: {
  projects?: typeof PROJECTS
  ownerBuilt?: boolean
  label?: string
  heading?: string
  body?: string
  eyebrow?: string
  subtitle?: string
}) {
  const pieces = gridPieces(projects)
  if (pieces.length === 0) return null
  const line = hasText(subtitle) ? subtitle! : tr('showcase.pieceLine')
  return (
    <section id="pieces" className="scroll-mt-32 bg-fam-page" data-showcase="pieces">
      <div className="container-x py-section">
        {(hasText(eyebrow) || hasText(heading)) && (
          <div className="mb-14 flex flex-col items-center text-center md:mb-20">
            {hasText(eyebrow) && <Chip>{eyebrow}</Chip>}
            {hasText(heading) && <GoldHeading text={heading!} className={`text-4xl sm:text-5xl lg:text-[56px] ${hasText(eyebrow) ? 'mt-8' : ''}`} />}
          </div>
        )}
        <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-14 p-0 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-16">
          {pieces.map((p, i) => {
            const { name } = pieceText(p)
            return (
              <li key={`${p.image}-${i}`}>
                <figure className="m-0">
                  <div className="aspect-[4/5] overflow-hidden border border-fam-hairline bg-fam-page">
                    <img src={imageSrc(p.image)} alt={p.alt ?? name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <figcaption className="mt-6 text-center">
                    {hasText(name) && <p className={`${CAPS} text-[12px] text-fam-ink`}>{name}</p>}
                    <p className={`mt-2 ${CAPS} text-[10px] text-fam-accent-text`}>{line}</p>
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
