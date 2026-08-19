import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { ArrowRight } from 'lucide-react'
import { SectionHeaderFriendly } from '~/components/SectionHeaderFriendly'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// ServicesPreview VARIANT: 'friendly', warm, bright offerings grid. Identity
// copy from SITE.homeServices (zero hardcoded section copy). White rounded cards
// with soft shadows on a warm-cream section, coral accents, rounded friendly
// type. Prop signature identical to ServicesPreviewBlock; returns Element | null.
//
// TOKEN DISCIPLINE: SectionHeaderFriendly; light-warm surfaces component-owned
// (peach-cream section #FFF6EC, white cards, sand hairline #F0E6DA, charcoal/gray
// text); emerald-* (DNA → coral) accent; rounded-* (DNA) soft corners; font-
// display (DNA). Images via serviceImageUrl(slug). No bg-brand-*, no .btn pill.
export function ServicesFriendlyBlock({
  label,
  heading,
  body,
  exploreLabel = tr('common.learnMore'),
  moreLink = tr('common.seeAllServices'),
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
    <section className="bg-[#FFF6EC]">
      <div className="container-x py-16 md:py-24">
        <SectionHeaderFriendly
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
              className="group flex flex-col overflow-hidden rounded-3xl border border-[#F0E6DA] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={serviceImageUrl(s.slug)}
                  alt={s.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-bold tracking-tight text-[#3D3530]">
                  {s.name}
                </h3>
                <p className="mt-2 text-[#7A6F66]">{s.short}</p>
                <div className="mt-5 flex items-center gap-1 font-display font-semibold text-emerald-700 transition-all group-hover:gap-2">
                  {exploreLabel} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {SERVICES.length > previewServices.length && (
          <div className="mt-10">
            <Link
              to="/services"
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90"
            >
              {moreLink} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
