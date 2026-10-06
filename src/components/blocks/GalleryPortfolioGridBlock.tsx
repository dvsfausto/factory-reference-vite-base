import { PROJECTS } from '~/data/projects'
import { tr } from '~/lib/i18n'
import { imageSrc } from '~/lib/asset-url'
import { placeLine } from '~/lib/place'
import { ARROW } from '~/lib/editorial'
import { faceSafeStyle, galleryPageHref, portfolioPicks, projectCategory } from '~/lib/editorial-media'
import { EditorialHeading, Kicker, Numeral } from '~/components/editorial/Primitives'

// Gallery VARIANT: 'portfolio-grid' (the Editorial look, ZB-147 W1.2). A kicker and a serif heading, then three tall
// 3:4 cards in a row: the photo, "01 · <tag>" (the project's category, else where the business works), the title in
// the display face and the arrow at the right. Cards are PROJECTS grouped by category (portfolioPicks); each links to
// the gallery page when the site has one. Fewer than three photos → the available columns; none → nothing.
//
// TOKEN DISCIPLINE: every colour is a fam-* token; rhythm py-section; photos through imageSrc(), lazy, face-safe crop.
export function GalleryPortfolioGridBlock({
  projects = PROJECTS,
  label = tr('editorial.portfolioKicker'),
  heading = tr('editorial.portfolioHeading'),
  body,
}: {
  projects?: typeof PROJECTS
  label?: string
  heading?: string
  body?: string
}) {
  const picks = portfolioPicks(projects)
  if (picks.length === 0) return null
  const href = galleryPageHref()
  const cols = { 1: 'grid-cols-1', 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' }[picks.length as 1 | 2 | 3]
  return (
    <section className="bg-fam-page">
      <div className="container-x py-section">
        <div className="max-w-3xl">
          <Kicker>{label}</Kicker>
          <EditorialHeading text={heading} size="lg" className="mt-5" />
          {body && <p className="mt-5 max-w-[34rem] font-sans text-[17px] leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>

        <div className={`mt-12 grid gap-6 ${cols}`}>
          {picks.map((p, i) => {
            const tag = projectCategory(p) || placeLine()
            const card = (
              <>
                <div className="aspect-[3/4] overflow-hidden bg-fam-surface-2">
                  <img
                    src={imageSrc(p.image)}
                    alt={p.alt ?? p.title}
                    loading="lazy"
                    style={faceSafeStyle()}
                    className="h-full w-full object-cover transition-transform duration-(--motion-slow) group-hover:scale-(--hov-zoom)"
                  />
                </div>
                <div className="mt-5 flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.18em] text-fam-ink-muted">
                  <Numeral n={i + 1} />
                  {tag && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{tag}</span>
                    </>
                  )}
                </div>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <h3 className="font-display text-[28px] font-normal leading-tight text-fam-ink">{p.title}</h3>
                  <span aria-hidden="true" className="mt-2 font-sans text-[13px] text-fam-ink">{ARROW}</span>
                </div>
              </>
            )
            return href ? (
              <a key={`${p.title}-${i}`} href={href} className="group block">
                {card}
              </a>
            ) : (
              <figure key={`${p.title}-${i}`} className="group">
                {card}
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
