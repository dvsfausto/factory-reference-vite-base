import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { ArrowRight } from 'lucide-react'
import { SectionHeaderCorporate } from '~/components/SectionHeaderCorporate'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// ServicesPreview VARIANT: 'corporate', a structured "practice areas" grid.
// Identity copy from SITE.homeServices. Boxed bordered cards (defined borders,
// tight radius), a cool blue-gray section, dense layout, heavy grotesque type.
// Prop signature identical to ServicesPreviewBlock; returns Element | null.
//
// TOKEN DISCIPLINE: SectionHeaderCorporate; structured light surfaces
// component-owned (section #F4F6F9, white cards, border #D8DEE7, navy text);
// emerald-* (DNA → navy) accent; rounded-* (DNA, tight); font-display (DNA).
// Images via serviceImageUrl(slug). No bg-brand-*, no .btn pill.
export function ServicesCorporateBlock({
  site = SITE,
  services = SERVICES,
  label,
  heading,
  body,
  exploreLabel = tr('common.learnMore'),
  moreLink = tr('section.allPracticeAreas'),
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
  const previewServices = services.slice(0, 3)
  if (previewServices.length === 0) return null
  return (
    <section className="border-y border-[#D8DEE7] bg-[#F4F6F9]">
      <div className="container-x py-16 md:py-20">
        <SectionHeaderCorporate
          label={label ?? ((site as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.label ?? tr('section.whatWeDo'))}
          heading={heading ?? ((site as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.heading ?? tr('nav.services'))}
          body={body ?? ((site as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.body ?? tr('section.servicesBody'))}
        />
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-[#D8DEE7] bg-[#D8DEE7] md:grid-cols-3">
          {previewServices.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group flex flex-col bg-white transition-colors hover:bg-[#FAFBFC]"
            >
              <div className="aspect-[16/9] overflow-hidden border-b border-[#D8DEE7]">
                <img
                  src={serviceImageUrl(s.slug)}
                  alt={s.name}
                  loading="lazy"
                  width={800}
                  height={450}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-display text-xl font-bold tracking-tight text-[#1A2433]">
                  {s.displayName}
                </h3>
                <p className="mt-2 text-[#5A6678]">{s.short}</p>
                <div className="mt-5 flex items-center gap-1 font-display text-sm font-semibold text-emerald-700 transition-all group-hover:gap-2">
                  {exploreLabel} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {services.length > previewServices.length && (
          <div className="mt-10">
            <Link
              to="/services"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {moreLink} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
