import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { MapPin } from 'lucide-react'
import { SectionHeader } from '~/components/SectionHeader'
import { AREAS } from '~/data/areas'

// Markup extracted VERBATIM from routes/index.tsx (the SERVICE AREAS section).
// Self-omits when there are no areas, exactly today's `{AREAS.length > 0 && …}`.
export function ServiceAreasBlock({
  areas = AREAS,
  label = tr('section.serviceAreas'),
  heading = tr('section.whereWeHeading'),
  scriptAccent = tr('section.workAccent'),
  body = tr('section.localCrews'),
  moreLink = tr('nav.viewAllAreas'),
}: {
  areas?: typeof AREAS
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  moreLink?: string
}) {
  if (areas.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-16 md:py-24">
        <SectionHeader
          label={label}
          heading={heading}
          scriptAccent={scriptAccent}
          body={body}
        />
        <div className="flex flex-wrap justify-center gap-2">
          {areas.map((a) => (
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
          <Link to="/areas" className="btn btn-md btn-secondary">{moreLink}</Link>
        </div>
      </div>
    </section>
  )
}
