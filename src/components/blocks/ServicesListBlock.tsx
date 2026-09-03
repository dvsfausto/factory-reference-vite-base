import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { ArrowRight } from 'lucide-react'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'

// ServicesPreview LAYOUT: 'list', an editorial, type-forward index: each service
// is a hairline-separated row with an ordinal, a large display name, a blurb, and
// a quiet arrow. No imagery, distinct precisely because it is restrained and
// reads like a well-set table of contents. Character-agnostic.
//
// Editorial restraint (not a stripped grid): real hairline rules between rows,
// a deliberate type hierarchy (small emerald ordinal, large name, muted blurb),
// and roomy row padding. Works for any number of services and needs no photos.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned
// (white / slate #0F172A / #64748B / hairline #E6E8EC). Never bg-brand-* / .btn.
//
// Identity copy read from SITE.homeServices via inline cast. Prop signature
// identical to ServicesPreviewBlock; returns Element | null.
export function ServicesListBlock({
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
  const rows = services.slice(0, 8)
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

        <div className="mt-12 border-t border-[#E6E8EC]">
          {rows.map((s, i) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group grid grid-cols-1 items-baseline gap-2 border-b border-[#E6E8EC] py-8 transition-colors md:grid-cols-12 md:gap-8 md:py-10"
            >
              <span className="font-display text-sm font-semibold text-emerald-600 md:col-span-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-[#0F172A] transition-colors group-hover:text-emerald-700 md:col-span-5 md:text-3xl">
                {s.displayName}
              </h3>
              <p className="text-base leading-relaxed text-[#64748B] md:col-span-5">{s.short}</p>
              <span className="hidden items-center justify-end text-emerald-600 md:col-span-1 md:flex">
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            to="/services"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {moreLink} <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="font-display text-sm font-medium text-[#64748B]">{exploreLabel}</span>
        </div>
      </div>
    </section>
  )
}
