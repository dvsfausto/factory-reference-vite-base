import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { ArrowRight } from 'lucide-react'
import { elegantSurface } from '~/lib/elegant-surface'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// ServicesPreview VARIANT: 'elegant', refined offerings grid. Identity copy from
// SITE.homeServices. Surface from elegantSurface(): LIGHT by default (warm ivory
// section, white cards), DARK on opt-in (espresso section, leather cards, the
// original, byte-identical). Prop signature identical to ServicesPreviewBlock;
// returns Element | null.
//
// TOKEN DISCIPLINE: SectionHeaderElegant (serif, no script); surface neutrals from
// elegantSurface(); emerald-* (DNA accent) on hover + the explore link; rounded-*
// (DNA); font-display (DNA serif). Images via serviceImageUrl(slug). No bg-brand-*,
// no .btn pill.
export function ServicesElegantBlock({
  label,
  heading,
  body,
  exploreLabel = tr('common.viewService'),
  moreLink = tr('common.seeAllServices'),
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  exploreLabel?: string
  moreLink?: string
}) {
  const s = elegantSurface()
  const previewServices = SERVICES.slice(0, 5)
  if (previewServices.length === 0) return null
  const hs = (SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices
  const secHeading = heading ?? hs?.heading ?? tr('nav.services')
  const secBody = body ?? hs?.body ?? tr('section.servicesBody')
  void exploreLabel
  void label
  // EDITORIAL, taste-skill revised: NO eyebrow (headline alone), NO split-header (heading + lede STACKED),
  // and image-forward CARDS instead of a hairline text index — a magazine feature grid: the lead service
  // large with a wide image, the rest in a lighter column, real photos, serif names, generous air.
  const [lead, ...rest] = previewServices
  return (
    <section className={s.section}>
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <h2 className={`font-display text-4xl font-medium leading-tight tracking-tight ${s.text} sm:text-5xl`}>{secHeading}</h2>
          <p className={`mt-4 text-lg leading-relaxed ${s.muted}`}>{secBody}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2">
          {/* Lead service: large, image-forward. */}
          {lead && (
            <Link to="/services/$slug" params={{ slug: lead.slug }} className="group block">
              <div className="zi-media overflow-hidden rounded-2xl">
                <img src={serviceImageUrl(lead.slug)} alt={lead.name} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              </div>
              <h3 className={`mt-6 font-display text-3xl font-medium tracking-tight ${s.text} transition-colors group-hover:text-emerald-800`}>{lead.displayName}</h3>
              <p className={`mt-2 max-w-md ${s.muted}`}>{lead.short}</p>
            </Link>
          )}
          {/* Remaining services: a lighter stacked column, each with a small image. */}
          <div className="flex flex-col justify-center gap-8">
            {rest.map((sv) => (
              <Link key={sv.slug} to="/services/$slug" params={{ slug: sv.slug }} className="group flex items-center gap-5">
                <div className="zi-media h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                  <img src={serviceImageUrl(sv.slug)} alt={sv.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className={`font-display text-xl font-medium tracking-tight ${s.text} transition-colors group-hover:text-emerald-800`}>{sv.name}</h3>
                  <p className={`mt-1 text-sm ${s.muted}`}>{sv.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {SERVICES.length > previewServices.length && (
          <div className={`mt-14 border-t ${s.border} pt-8`}>
            <Link to="/services" className="inline-flex items-center gap-2 font-display text-base font-medium text-emerald-800 underline-offset-4 transition-colors hover:underline">
              {moreLink} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
