import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { SectionHeaderElegant } from '~/components/SectionHeaderElegant'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services'
import { serviceImageUrl } from '~/data/images'

// ServicesPreview VARIANT: 'elegant' — dark-luxury offerings grid. Mirrors
// ServicesBoldBlock's data discipline (identity copy from SITE.homeServices) but
// on warm-dark leather cards with a refined serif. Prop signature identical to
// ServicesPreviewBlock; returns Element | null (matches the default).
//
// TOKEN DISCIPLINE: SectionHeaderElegant (serif, no script); warm-dark surfaces
// (espresso section #1A1410, leather cards #241C16, hairline #3A2E24, cream/taupe
// text) component-owned; emerald-* (DNA → amber) accent on hover + the explore
// link; rounded-* (DNA) soft corners; font-display (DNA serif). Images via the
// keyed helper serviceImageUrl(slug). No bg-brand-*, no .btn pill.
export function ServicesElegantBlock({
  label,
  heading,
  body,
  exploreLabel = 'View offering',
  moreLink = 'All offerings',
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
    <section className="bg-[#1A1410]">
      <div className="container-x py-20 md:py-28">
        <SectionHeaderElegant
          label={label ?? SITE.homeServices.label}
          heading={heading ?? SITE.homeServices.heading}
          body={body ?? SITE.homeServices.body}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {previewServices.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group flex flex-col overflow-hidden rounded-xl border border-[#3A2E24] bg-[#241C16] transition-all hover:-translate-y-1 hover:border-emerald-600"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={serviceImageUrl(s.slug)}
                  alt={s.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="h-full w-full object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl font-medium tracking-tight text-[#F2E8DC]">
                  {s.name}
                </h3>
                <p className="mt-2 text-[#B8A893]">{s.short}</p>
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
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-emerald-600/60 px-7 font-display text-sm font-medium uppercase tracking-[0.18em] text-[#F2E8DC] transition-colors hover:border-emerald-600 hover:bg-emerald-600/10"
            >
              {moreLink} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
