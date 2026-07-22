import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '~/components/SectionHeader'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl } from '~/data/images'

// Markup extracted VERBATIM from routes/index.tsx (the SERVICES PREVIEW
// section). Self-omits when there are no services — exactly today's
// `{previewServices.length > 0 && …}`.
export function ServicesPreviewBlock({
  label = 'Our services',
  heading = 'What we',
  scriptAccent = 'do',
  body = 'A focused list of services, done well.',
  exploreLabel = 'Explore',
  moreLink = 'View all services →',
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
  // Columns match the count so a lone (or paired) service — a single owner-service generic
  // build — doesn't strand in an otherwise-empty 3-col row. 3+ → md:grid-cols-3, byte-identical
  // for the template verticals (which always carry ≥3 services).
  const gridCols =
    previewServices.length === 1
      ? 'md:grid-cols-1 md:max-w-sm md:mx-auto'
      : previewServices.length === 2
        ? 'md:grid-cols-2 md:max-w-2xl md:mx-auto'
        : 'md:grid-cols-3'
  return (
    <section className="bg-brand-50 border-y border-brand-100">
      <div className="container-x py-16 md:py-24">
        <SectionHeader
          label={label}
          heading={heading}
          scriptAccent={scriptAccent}
          body={body}
        />
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {previewServices.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="card-stead overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={serviceImageUrl(s.slug)}
                  alt={s.name}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl">{s.name}</h3>
                <p className="mt-2 text-ink-500">{s.short}</p>
                <div className="mt-5 text-brand-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  {exploreLabel} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {SERVICES.length > previewServices.length && (
          <div className="mt-8 text-center">
            <Link to="/services" className="btn btn-md btn-secondary">{moreLink}</Link>
          </div>
        )}
      </div>
    </section>
  )
}
