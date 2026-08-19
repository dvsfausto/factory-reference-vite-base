import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { ArrowRight } from 'lucide-react'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// ServicesPreview VARIANT: 'modern', clean offerings grid. Identity copy from
// SITE.homeServices. A cool-gray section, sharp minimal cards (thin border,
// restrained radius, subtle shadow on hover), generous whitespace, geometric sans.
// Prop signature identical to ServicesPreviewBlock; returns Element | null.
//
// TOKEN DISCIPLINE: SectionHeaderModern; cool light surfaces component-owned
// (section #F6F7F9, white cards, border #E6E8EC, slate text); emerald-* (DNA →
// indigo) accent; rounded-* (DNA, restrained); font-display (DNA). Images via
// serviceImageUrl(slug). No bg-brand-*, no .btn pill.
export function ServicesModernBlock({
  label,
  heading,
  body,
  exploreLabel = tr('common.learnMore'),
  moreLink = tr('common.allServices'),
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  exploreLabel?: string
  moreLink?: string
}) {
  const previewServices = SERVICES.slice(0, 6)
  if (previewServices.length === 0) return null
  const hs = (SITE as { homeServices?: { heading?: string; body?: string } }).homeServices
  const secHeading = heading ?? hs?.heading ?? tr('nav.services')
  const secBody = body ?? hs?.body ?? tr('section.servicesBody')
  void label
  void exploreLabel
  // MODERN, taste-skill light touch: TIGHT + ASYMMETRIC (the one structural move that separates modern from
  // friendly's three equal rounded cards). A heading rail on the left, a dense 2-column grid of compact
  // horizontal cards on the right — small radius, tight gaps, edge-aligned. No eyebrow. The right column is a
  // visual grid (not filler text), so this is not the banned split-header.
  return (
    <section className="bg-[#F6F7F9]">
      <div className="container-x py-20 md:py-28">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">{secHeading}</h2>
            <p className="mt-3 max-w-xs leading-relaxed text-[#64748B]">{secBody}</p>
            {SERVICES.length > previewServices.length && (
              <Link to="/services" className="mt-6 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-emerald-600 transition-all hover:gap-2.5">
                {moreLink} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8">
            {previewServices.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="zi-rise group flex items-center gap-4 rounded-lg border border-[#E6E8EC] bg-white p-3 transition-colors hover:border-emerald-500"
              >
                <div className="zi-media h-16 w-16 shrink-0 overflow-hidden rounded-md">
                  <img src={serviceImageUrl(s.slug)} alt={s.name} loading="lazy" width={128} height={128} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-semibold tracking-tight text-[#0F172A]">{s.name}</h3>
                  <p className="mt-0.5 line-clamp-2 text-sm text-[#64748B]">{s.short}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#94A3B8] transition-all group-hover:translate-x-0.5 group-hover:text-emerald-600" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
