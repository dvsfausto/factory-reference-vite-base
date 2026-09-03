import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { ArrowRight } from 'lucide-react'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// ServicesPreview LAYOUT: 'alternating-rows', an Apple-style zigzag, one service
// per full-width row, image and text trading sides down the page with generous
// vertical rhythm. Character-agnostic: cool-light surface, modern tokens.
//
// Real rhythm (not stacked cards): deep row spacing, a large framed image balanced
// against a roomy text column, big display type. Images come from serviceImageUrl
// (slug-resolved, falling back to the hero image), so a business with no per-
// service photo still renders gracefully.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned
// (white / slate #0F172A / #64748B / border #E6E8EC). Never bg-brand-* / .btn.
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
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label ?? hs?.label ?? 'Our services'}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
            {heading ?? hs?.heading ?? 'What we do'}
          </h2>
          {(body ?? hs?.body) && (
            <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body ?? hs?.body}</p>
          )}
        </div>

        <div className="mt-16 space-y-20 md:mt-24 md:space-y-28">
          {rows.map((s, i) => (
            <div key={s.slug} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className={`overflow-hidden rounded-3xl border border-[#E6E8EC] shadow-sm ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img
                  src={serviceImageUrl(s.slug)}
                  alt={s.name}
                  loading="lazy"
                  width={900}
                  height={675}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <span className="font-display text-sm font-semibold text-emerald-600">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
                  {s.displayName}
                </h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-[#64748B]">{s.short}</p>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="group mt-6 inline-flex items-center gap-2 font-display text-base font-semibold text-emerald-600 transition-all hover:text-emerald-700"
                >
                  {exploreLabel} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {services.length > rows.length && (
          <div className="mt-16">
            <Link
              to="/services"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {moreLink} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
