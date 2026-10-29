import { imageSrc } from '~/lib/asset-url'
import { hasText } from '~/lib/has-text'
import { goldParts, piecesIn, pieceText, plainText } from '~/lib/showcase'
import { CAPS } from '~/components/showcase/Primitives'

// story VARIANT: 'showcase-signature' (the Showcase theme, 2026-10-29). Left: a two-line uppercase headline (params.heading,
// the gold-word rule; the gold words take the second line) and one sentence (params.body). Right: three large piece photos,
// one wide on top and two below, each named under it in spaced capitals (the caption's first line). The photos are the
// gallery items whose category is 'signature'. Phone: stacked. No photos and no heading: nothing.
export function StoryShowcaseSignatureBlock({ heading, body }: { label?: string; heading?: string; body?: string; site?: unknown }) {
  const pieces = piecesIn('signature').slice(0, 3)
  if (pieces.length === 0 && !hasText(heading)) return null
  const parts = goldParts(heading)
  const firstGold = parts.findIndex((p) => p.gold)
  return (
    <section className="bg-fam-page" data-showcase="signature">
      <div className="container-x py-section grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4 lg:pt-8">
          {parts.length > 0 && (
            <h2 className="font-display text-4xl font-normal uppercase leading-[1.05] tracking-[0.02em] text-fam-ink sm:text-5xl lg:text-[56px]" aria-label={plainText(heading)}>
              {parts.map((p, i) => (
                <span key={i} aria-hidden="true">
                  {i === firstGold && i > 0 && <br />}
                  <span className={p.gold ? 'text-fam-accent-text' : undefined}>{i === firstGold && i > 0 ? p.text.trimStart() : p.text}</span>
                </span>
              ))}
            </h2>
          )}
          <span aria-hidden="true" className="mt-8 block h-px w-12 bg-fam-accent" />
          {hasText(body) && <p className="mt-8 max-w-sm font-sans text-[15px] leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        {pieces.length > 0 && (
          <ul className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:col-span-8">
            {pieces.map((p, i) => {
              const { name } = pieceText(p)
              return (
                <li key={`${p.image}-${i}`} className={i === 0 ? 'sm:col-span-2' : undefined}>
                  <figure className="m-0">
                    <div className={`overflow-hidden border border-fam-hairline bg-fam-page ${i === 0 ? 'aspect-[4/5] sm:aspect-[16/10]' : 'aspect-[4/5]'}`}>
                      <img src={imageSrc(p.image)} alt={p.alt ?? name} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    {hasText(name) && <figcaption className={`mt-5 text-center ${CAPS} text-fam-ink`}>{name}</figcaption>}
                  </figure>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
