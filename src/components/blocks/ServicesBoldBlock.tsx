import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { ArrowRight } from 'lucide-react'
import { SectionHeaderBold } from '~/components/SectionHeaderBold'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// ServicesPreview VARIANT: 'bold', grounded/industrial services grid for trades.
// Patterns from HeroBoldFullbleedBlock (the catalog reference):
//   · IDENTITY COPY is DATA, label/heading/body read from SITE.homeServices
//     (promoted out of the block JSX defaults by the scaffolder), so the variant
//     renders zero hardcoded section copy.
//   · TOKEN DISCIPLINE, heading via SectionHeaderBold (font-display Oswald, no
//     script); emerald-* for the eyebrow + the "explore" accent (DNA accent);
//     rounded-* square cards (DNA radius, NOT card-stead's softer literal, these
//     cards build their own square frame); ink-* neutrals. No bg-brand-*, no .btn
//     pill.
//   · Images via the keyed helper serviceImageUrl(slug) + s.name alt, no
//     hardcoded paths.
// Prop signature is identical to ServicesPreviewBlock (uniform render path); the
// copy props are accepted as overrides and fall back to SITE.homeServices.
export function ServicesBoldBlock({
  label,
  heading,
  body,
  exploreLabel = tr('common.viewService'),
  moreLink = tr('common.allServices'),
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
    <section className="bg-background border-y border-ink-100">
      <div className="container-x py-16 md:py-24">
        <SectionHeaderBold
          label={label ?? ((SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.label ?? tr('section.whatWeDo'))}
          heading={heading ?? ((SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.heading ?? tr('nav.services'))}
          body={body ?? ((SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.body ?? tr('section.servicesBody'))}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewServices.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group flex flex-col overflow-hidden rounded-lg border border-ink-100 bg-white transition-all hover:-translate-y-1 hover:border-emerald-600 hover:shadow-xl"
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
                <h3 className="font-display text-xl font-semibold uppercase tracking-tight text-ink-900">
                  {s.displayName}
                </h3>
                <p className="mt-2 text-ink-500">{s.short}</p>
                <div className="mt-5 flex items-center gap-1 font-display text-sm font-semibold uppercase tracking-wide text-emerald-700 transition-all group-hover:gap-2">
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
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-7 font-display text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              {moreLink} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
