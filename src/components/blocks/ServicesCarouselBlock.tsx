import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { ArrowRight } from 'lucide-react'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// ServicesPreview LAYOUT: 'carousel', a horizontal, scroll-snap slider of service
// cards. The right call when there are many services: they live in a single
// swipeable track instead of an ever-taller grid. Character-agnostic, CSS-only
// (scroll-snap, no JS), so it is SSR-safe and degrades to a plain scroll row.
//
// Considered (not a row of cards that happens to overflow): snap alignment per
// card, a peek of the next card to signal scrollability, an inline hint, and a
// gradient fade at the trailing edge. Images via serviceImageUrl (slug-resolved,
// hero fallback) so a photo-less business still renders.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> fam-accent-* (DNA) restricted to 50/100/600/700. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned
// (white / slate #0F172A / #64748B / border #E6E8EC). Never bg-brand-* / .btn.
//
// Identity copy read from SITE.homeServices via inline cast. Prop signature
// identical to ServicesPreviewBlock; returns Element | null.
export function ServicesCarouselBlock({
  site = SITE,
  services = SERVICES,
  label,
  heading,
  body,
  exploreLabel = tr('common.learnMore'),
  moreLink = tr('common.allServices'),
}: {
  site?: typeof SITE
  services?: typeof SERVICES
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  exploreLabel?: string
  moreLink?: string
}) {
  const hs = (site as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices
  const cards = services.slice(0, 10)
  if (cards.length === 0) return null
  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
              <span className="h-px w-6 bg-fam-accent" />
              {label ?? hs?.label ?? 'Our services'}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
              {heading ?? hs?.heading ?? 'What we do'}
            </h2>
            {(body ?? hs?.body) && (
              <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body ?? hs?.body}</p>
            )}
          </div>
          <span className="font-display text-sm font-medium text-fam-ink-muted">Scroll for more →</span>
        </div>
      </div>

      <div className="relative">
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-6 [scrollbar-width:thin]">
          {cards.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-fam-hairline bg-fam-card transition-all hover:border-fam-accent hover:shadow-(--elev-2) md:w-[340px]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={serviceImageUrl(s.slug)}
                  alt={s.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-(--motion-slow) group-hover:scale-(--hov-zoom)"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-display text-xl font-semibold tracking-tight text-fam-ink">{s.displayName}</h3>
                <p className="mt-2 flex-1 text-fam-ink-muted">{s.short}</p>
                <span className="mt-6 inline-flex items-center gap-1 font-display text-sm font-semibold text-fam-accent-text transition-all group-hover:gap-2">
                  {exploreLabel} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-fam-card to-transparent md:block" />
      </div>

      {services.length > cards.length && (
        <div className="container-x mt-8">
          <Link
            to="/services"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-cta px-7 font-display text-sm font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)"
          >
            {moreLink} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  )
}
