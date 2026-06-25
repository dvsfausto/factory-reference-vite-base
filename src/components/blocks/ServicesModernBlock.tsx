import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { SectionHeaderModern } from '~/components/SectionHeaderModern'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services'
import { serviceImageUrl } from '~/data/images'

// ServicesPreview VARIANT: 'modern' — clean offerings grid. Identity copy from
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
  exploreLabel = 'Learn more',
  moreLink = 'All services',
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  exploreLabel?: string
  moreLink?: string
}) {
  const previewServices = SERVICES.slice(0, 3)
  if (previewServices.length === 0) return null
  return (
    <section className="bg-[#F6F7F9]">
      <div className="container-x py-20 md:py-28">
        <SectionHeaderModern
          label={label ?? ((SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.label ?? 'What we do')}
          heading={heading ?? ((SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.heading ?? 'Services')}
          body={body ?? ((SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.body ?? 'A focused set of services, done well.')}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {previewServices.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white transition-all hover:border-emerald-600 hover:shadow-md"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={serviceImageUrl(s.slug)}
                  alt={s.name}
                  loading="lazy"
                  width={800}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-display text-xl font-semibold tracking-tight text-[#0F172A]">
                  {s.name}
                </h3>
                <p className="mt-2 text-[#64748B]">{s.short}</p>
                <div className="mt-6 flex items-center gap-1 font-display text-sm font-semibold text-emerald-600 transition-all group-hover:gap-2">
                  {exploreLabel} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {SERVICES.length > previewServices.length && (
          <div className="mt-12">
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
