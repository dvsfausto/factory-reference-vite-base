import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { SectionHeader } from '~/components/SectionHeader'
import { SERVICES } from '~/data/services'
import { serviceImageUrl } from '~/data/images'

// Markup extracted VERBATIM from routes/index.tsx (the SERVICES PREVIEW
// section). Self-omits when there are no services — exactly today's
// `{previewServices.length > 0 && …}`.
export function ServicesPreviewBlock() {
  const previewServices = SERVICES.slice(0, 3)
  if (previewServices.length === 0) return null
  return (
    <section className="bg-brand-50 border-y border-brand-100">
      <div className="container-x py-16 md:py-24">
        <SectionHeader
          label="Our services"
          heading="What we"
          scriptAccent="do"
          body="A focused list of services, done well."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  Explore <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {SERVICES.length > previewServices.length && (
          <div className="mt-8 text-center">
            <Link to="/services" className="btn btn-md btn-secondary">View all services →</Link>
          </div>
        )}
      </div>
    </section>
  )
}
