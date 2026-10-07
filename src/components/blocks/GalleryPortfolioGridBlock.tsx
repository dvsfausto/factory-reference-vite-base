import { PROJECTS } from '~/data/projects'
import { tr } from '~/lib/i18n'
import { imageSrc } from '~/lib/asset-url'
import { placeLine } from '~/lib/place'
import { ARROW } from '~/lib/editorial'
import { faceSafeStyle, portfolioCard, portfolioPicks, projectCategory, serviceBySlug, serviceFor } from '~/lib/editorial-media'
import { ownerServiceImageUrl } from '~/data/images'
import { EditorialHeading, Kicker, Numeral } from '~/components/editorial/Primitives'

// Gallery VARIANT: 'portfolio-grid' (the Editorial look, ZB-147 W1.2). A kicker and a serif heading, then three tall
// 3:4 cards in a row: the photo, "01 · <tag>" (the project's category, else where the business works), the title in
// the display face and the arrow at the right. Cards are PROJECTS grouped by category (portfolioPicks). A card is
// TITLED BY THE SERVICE IT OPENS (the owner's card<N>Title / card<N>Service settings first, else the service its photo
// matches), never by a gallery or site title; a card with no service and no category is left out (portfolioCard).
// Fewer than three cards → the available columns; none → nothing.
//
// TOKEN DISCIPLINE: every colour is a fam-* token; rhythm py-section; photos through imageSrc(), lazy, face-safe crop.
export function GalleryPortfolioGridBlock({
  projects = PROJECTS,
  label = tr('editorial.portfolioKicker'),
  heading = tr('editorial.portfolioHeading'),
  body,
  cards = [],
  ownerBuilt = false,
}: {
  projects?: typeof PROJECTS
  label?: string
  heading?: string
  body?: string
  cards?: Array<{ title?: string; service?: string }>
  /** the page's gallery is the owner's own list (render-section): show it as given */
  ownerBuilt?: boolean
}) {
  // ★ an OWNER-BUILT gallery (design_dna.galleries) shows exactly the owner's photos in the owner's order, every one of them,
  // no grouping by category and no card dropped: a photo without a service or a category still gets its card
  // An owner-built card is titled by ITS photo's kind of work (the service that category names), never by the slot's title
  // setting: card<N>Title/Service were chosen for the category-grouped grid, and a family photo under "Weddings" is a false label.
  // ★ A CARD'S PHOTO MATCHES ITS TITLE (Karli's live home, 2026-10-07: a family photo under "Weddings & Celebrations"): a slot that
  // names a service shows a photo OF that kind of work: the first library photo whose category names the service, else the
  // service's own photo, else the grouped pick. Slots without a service keep the grouped pick (one photo per category).
  const slotPicks = (): typeof projects => {
    const base = portfolioPicks(projects)
    const used = new Set<string>()
    return base.map((p, i) => {
      const svc = serviceBySlug(cards[i]?.service)
      if (!svc) { used.add(p.image); return p }
      const match = projects.find((q) => !used.has(q.image) && projectCategory(q) && serviceFor(projectCategory(q))?.slug === svc.slug) // by the photo's CATEGORY only: a caption that mentions another kind of work must not move it
      if (match) { used.add(match.image); return match }
      const own = ownerServiceImageUrl(svc.slug)
      if (own && !used.has(own)) { const name = String(svc.displayName ?? svc.name ?? ''); used.add(own); return { title: name, image: own, alt: name, category: name } as (typeof projects)[number] }
      used.add(p.image); return p
    })
  }
  const picks = (ownerBuilt ? projects : slotPicks())
    .map((p, i) => ({ p, card: portfolioCard(p, ownerBuilt ? undefined : cards[i]) ?? (ownerBuilt ? { title: p.alt ?? p.title ?? '', href: null } : null) }))
    .filter((x): x is { p: (typeof projects)[number]; card: NonNullable<ReturnType<typeof portfolioCard>> } => x.card !== null)
  if (picks.length === 0) return null
  const cols = { 1: 'grid-cols-1', 2: 'grid-cols-1 sm:grid-cols-2' }[picks.length as 1 | 2] ?? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  return (
    <section className="bg-fam-page">
      <div className="container-x py-section">
        <div className="max-w-3xl">
          <Kicker>{label}</Kicker>
          <EditorialHeading text={heading} size="lg" className="mt-5" />
          {body && <p className="mt-5 max-w-[34rem] font-sans text-[17px] leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>

        <div className={`mt-12 grid gap-6 ${cols}`}>
          {picks.map(({ p, card: pick }, i) => {
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
                  <h3 className="font-display text-[28px] font-normal leading-tight text-fam-ink">{pick.title}</h3>
                  <span aria-hidden="true" className="mt-2 font-sans text-[13px] text-fam-ink">{ARROW}</span>
                </div>
              </>
            )
            // the card's own service page (a portfolio card is a kind of work), else the gallery page when the site has one
            const cardHref = pick.href
            return cardHref ? (
              <a key={`${p.title}-${i}`} href={cardHref} className="group block">
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
