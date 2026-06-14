import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { SectionHeader } from '~/components/SectionHeader'
import { AREAS } from '~/data/areas'

// Markup extracted VERBATIM from routes/index.tsx (the SERVICE AREAS section).
// Self-omits when there are no areas — exactly today's `{AREAS.length > 0 && …}`.
export function ServiceAreasBlock() {
  if (AREAS.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-16 md:py-24">
        <SectionHeader
          label="Service areas"
          heading="Where we"
          scriptAccent="work"
          body="Local crews, familiar streets."
        />
        <div className="flex flex-wrap justify-center gap-2">
          {AREAS.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="badge-pill bg-white border border-ink-100 text-ink-700 hover:border-brand-600 hover:text-brand-600 normal-case tracking-normal text-sm"
            >
              <MapPin className="h-3.5 w-3.5" /> {a.name}
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/areas" className="btn btn-md btn-secondary">View all areas →</Link>
        </div>
      </div>
    </section>
  )
}
