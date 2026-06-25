import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeaderCreative } from '~/components/SectionHeaderCreative'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services'
import { serviceImageUrl } from '~/data/images'

// ServicesPreview VARIANT: 'creative' — a STAGGERED, asymmetric card grid (cards
// offset at different vertical positions), big rounded shapes, magenta accents,
// expressive type. Identity copy from SITE.homeServices. Prop signature identical
// to ServicesPreviewBlock; returns Element | null.
//
// TOKEN DISCIPLINE: SectionHeaderCreative; expressive light surfaces
// component-owned (white section, off-white cards #FBFAFC, ink text); emerald-*
// (DNA → magenta) accents; rounded-* (DNA, large); font-display (DNA). Images via
// serviceImageUrl(slug). No bg-brand-*, no .btn pill.
export function ServicesCreativeBlock({
  label,
  heading,
  body,
  exploreLabel = 'See the work',
  moreLink = 'Everything we do',
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
  // Staggered offsets give the grid an off-balance, editorial rhythm.
  const offsets = ['lg:mt-0', 'lg:mt-12', 'lg:mt-4']
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <SectionHeaderCreative
          label={label ?? ((SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.label ?? 'What we do')}
          heading={heading ?? ((SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.heading ?? 'Services')}
          body={body ?? ((SITE as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices?.body ?? 'A focused set of services, done well.')}
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {previewServices.map((s, i) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className={`group flex flex-col overflow-hidden rounded-3xl bg-[#FBFAFC] transition-transform hover:-translate-y-1.5 ${offsets[i] ?? ''}`}
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
              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-display text-2xl font-bold tracking-tight text-[#18181B]">
                  {s.name}
                </h3>
                <p className="mt-2 text-[#71717A]">{s.short}</p>
                <div className="mt-6 inline-flex items-center gap-1 font-display font-bold text-emerald-600 transition-all group-hover:gap-2">
                  {exploreLabel} <ArrowUpRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {SERVICES.length > previewServices.length && (
          <div className="mt-14">
            <Link
              to="/services"
              className="inline-flex h-14 items-center gap-2 rounded-2xl bg-primary px-8 font-display text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {moreLink} <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
