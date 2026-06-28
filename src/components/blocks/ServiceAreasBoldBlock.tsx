import { Link } from '@tanstack/react-router'
import { SITE } from '~/data/site'
import { MapPin } from 'lucide-react'
import { SectionHeaderBold } from '~/components/SectionHeaderBold'
import { AREAS } from '~/data/areas'

// ServiceAreas VARIANT: 'bold' — identical to ServiceAreasBlock except it wires
// in the EXISTING SectionHeaderBold (solid Oswald, no ◆ diamond, no script
// flourish). Targeted polish, gated to the 'bold' variant so other verticals
// keep the default header byte-identically. Prop signature matches
// ServiceAreasBlock. Area chips use the emerald accent on hover (DNA), not the
// brand literal.
export function ServiceAreasBoldBlock({
  label = ((SITE as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.label ?? 'Service areas'),
  heading = ((SITE as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.heading ?? 'Where we'),
  scriptAccent = ((SITE as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.scriptAccent ?? 'work'),
  body = ((SITE as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.body ?? 'Local coverage, close to home.'),
  moreLink = 'All areas',
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  moreLink?: string
}) {
  if (AREAS.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-16 md:py-24">
        <SectionHeaderBold label={label} heading={heading} scriptAccent={scriptAccent} body={body} />
        <div className="flex flex-wrap gap-2">
          {AREAS.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="inline-flex items-center gap-1.5 rounded-md border border-ink-100 px-3 py-2 text-sm text-ink-700 transition-colors hover:border-emerald-600 hover:text-emerald-700"
            >
              <MapPin className="h-3.5 w-3.5" /> {a.name}
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/areas"
            className="inline-flex h-12 items-center rounded-md border border-ink-300 px-6 font-display text-sm font-semibold uppercase tracking-wide text-ink-900 transition-colors hover:border-emerald-600 hover:text-emerald-700"
          >
            {moreLink}
          </Link>
        </div>
      </div>
    </section>
  )
}
