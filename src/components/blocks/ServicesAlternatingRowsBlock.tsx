import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { ArrowRight } from 'lucide-react'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl, serviceImageFocusStyle } from '~/data/images'
import { hasServicePhoto } from '~/lib/service-photo'

// ServicesPreview LAYOUT: 'alternating-rows', an Apple-style zigzag, one service
// per full-width row, image and text trading sides down the page with generous
// vertical rhythm. Character-agnostic: cool-light surface, modern tokens.
//
// Real rhythm (not stacked cards): deep row spacing, a large framed image balanced
// against a roomy text column, big display type. Images come from serviceImageUrl
// (slug-resolved, falling back to the hero image), so a business with no per-
// service photo still renders gracefully.
//
// ★ WITHOUT PHOTOS THE SECTION IS A BALANCED GRID (ZB-154, 2026-10-11). A zigzag is a rhythm of pictures; with the photos
// off (the owner's choice) the rows became one short paragraph after another down the left of an empty page, and the
// "Get started" link beside "Learn more" was a 23px pill with no padding (Uplift Your Career, Fausto: "the services
// section does not render correctly", "the button does not look good"). Now: when no service has a photo, the services
// are even cards in a grid (two columns for two or four services, three otherwise; one column on a phone), each with
// its numeral, name, lede and the same actions. When some have photos, the zigzag stays for those rows and a
// photo-less row keeps the words across the row. The actions are one row: a real primary button for "Get started"
// (the hero CTA's own size and shape) beside the "Learn more" link, baseline aligned.
//
// TOKEN DISCIPLINE: primary CTA -> bg-cta / text-cta-foreground (BRAND-owned). Accent -> fam-accent-* (DNA) restricted
// to 50/100/600/700. Radius -> rounded-* (DNA). Font -> font-display (DNA). Never bg-brand-* / .btn.
//
// Identity copy read from SITE.homeServices via an inline cast (the SITE.surface /
// hero video_url precedent) so a missing field never breaks the type-check.
// Prop signature identical to ServicesPreviewBlock; returns Element | null.
export function ServicesAlternatingRowsBlock({
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
  const rows = services.slice(0, 6)
  if (rows.length === 0) return null
  const anyPhoto = rows.some((s) => hasServicePhoto(s.slug))
  const gridCols = rows.length === 2 || rows.length === 4 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'

  const actions = (s: (typeof rows)[number]) => (
    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
      {s.buyUrl && (
        <a
          href={s.buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-cta px-6 font-display text-sm font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)"
        >
          {tr('section.getStarted')} <ArrowRight className="h-4 w-4" />
        </a>
      )}
      <Link
        to="/services/$slug"
        params={{ slug: s.slug }}
        className="group inline-flex items-center gap-2 font-display text-base font-semibold text-fam-accent-text transition-all hover:text-fam-accent-text-strong"
      >
        {exploreLabel} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-(--hov-nudge)" />
      </Link>
    </div>
  )

  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label ?? hs?.label ?? tr('section.ourServices')}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading ?? hs?.heading ?? tr('section.whatWeDo')}
          </h2>
          {(body ?? hs?.body) && (
            <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body ?? hs?.body}</p>
          )}
        </div>

        {!anyPhoto ? (
          <div className={`mt-14 grid grid-cols-1 gap-6 ${gridCols}`} data-services-grid="">
            {rows.map((s, i) => (
              <article key={s.slug} className="flex h-full flex-col rounded-3xl border border-fam-hairline bg-fam-surface-2 p-8" data-service-card={s.slug}>
                <span className="font-display text-sm font-semibold text-fam-accent-text">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fam-ink sm:text-3xl">{s.displayName}</h3>
                <p className="mt-3 text-lg leading-relaxed text-fam-ink-muted">{s.short}</p>
                <div className="mt-auto">{actions(s)}</div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-16 space-y-20 md:mt-24 md:space-y-28">
            {rows.map((s, i) => (
              <div key={s.slug} className={`grid items-center gap-10 ${hasServicePhoto(s.slug) ? 'lg:grid-cols-2 lg:gap-16' : ''}`} data-service-card={s.slug}>
                {hasServicePhoto(s.slug) && <div className={`overflow-hidden rounded-3xl border border-fam-hairline elev-1 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <img
                    src={serviceImageUrl(s.slug)}
                    data-service-photo={s.slug} style={serviceImageFocusStyle(s.slug)}
                    alt={s.name}
                    loading="lazy"
                    width={900}
                    height={675}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>}
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <span className="font-display text-sm font-semibold text-fam-accent-text">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-fam-ink sm:text-4xl">
                    {s.displayName}
                  </h3>
                  <p className={`mt-4 text-lg leading-relaxed text-fam-ink-muted ${hasServicePhoto(s.slug) ? 'max-w-md' : 'max-w-2xl'}`}>{s.short}</p>
                  {actions(s)}
                </div>
              </div>
            ))}
          </div>
        )}

        {services.length > rows.length && (
          <div className="mt-16">
            <Link
              to="/services"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-cta px-7 font-display text-sm font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)"
            >
              {moreLink} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
