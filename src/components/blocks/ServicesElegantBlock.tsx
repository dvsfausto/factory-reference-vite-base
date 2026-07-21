import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { SectionHeaderElegant } from '~/components/SectionHeaderElegant'
import { elegantSurface } from '~/lib/elegant-surface'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// ServicesPreview VARIANT: 'elegant' — refined offerings grid. Identity copy from
// SITE.homeServices. Surface from elegantSurface(): LIGHT by default (warm ivory
// section, white cards), DARK on opt-in (espresso section, leather cards — the
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
  exploreLabel = 'View service',
  moreLink = 'See all services',
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  exploreLabel?: string
  moreLink?: string
}) {
  const s = elegantSurface()
  const previewServices = SERVICES.slice(0, 3)
  if (previewServices.length === 0) return null
  return (
    <section className={s.section}>
      <div className="container-x py-20 md:py-28">
        <SectionHeaderElegant
          label={label ?? ((SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.label ?? 'What we do')}
          heading={heading ?? ((SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.heading ?? 'Services')}
          body={body ?? ((SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.body ?? 'A focused set of services, done well.')}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {previewServices.map((sv) => (
            <Link
              key={sv.slug}
              to="/services/$slug"
              params={{ slug: sv.slug }}
              className={`group flex flex-col overflow-hidden rounded-xl border ${s.border} ${s.card} transition-all hover:-translate-y-1 hover:border-emerald-600`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={serviceImageUrl(sv.slug)}
                  alt={sv.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className={`font-display text-2xl font-medium tracking-tight ${s.text}`}>
                  {sv.name}
                </h3>
                <p className={`mt-2 ${s.muted}`}>{sv.short}</p>
                <div className="mt-5 flex items-center gap-1 text-sm font-medium uppercase tracking-[0.18em] text-emerald-600 transition-all group-hover:gap-2">
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
              className={`inline-flex h-12 items-center gap-2 rounded-lg border border-emerald-600/60 px-7 font-display text-sm font-medium uppercase tracking-[0.18em] ${s.text} transition-colors hover:border-emerald-600 hover:bg-emerald-600/10`}
            >
              {moreLink} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
