import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { MapPin } from 'lucide-react'
import { SectionHeaderFriendly } from '~/components/SectionHeaderFriendly'
import { AREAS } from '~/data/areas'

// ServiceAreas VARIANT: 'friendly', warm, bright area list. SectionHeaderFriendly
// (no script) + soft rounded coral-hover area chips. Prop signature matches
// ServiceAreasBlock; returns Element | null.
//
// TOKEN DISCIPLINE: light-warm surface component-owned; emerald-* (DNA → coral)
// on chip hover + icons; rounded-* (DNA, soft); font-display. No brand-* / .btn.
export function ServiceAreasFriendlyBlock({
  label = ((SITE as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.label ?? 'Service areas'),
  heading = ((SITE as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.heading ?? 'Where we'),
  scriptAccent = ((SITE as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.scriptAccent ?? 'work'),
  body = ((SITE as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.body ?? 'Local coverage, close to home.'),
  moreLink = tr('common.allAreas'),
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  moreLink?: string
}) {
  if (AREAS.length === 0) return null
  return (
    <section className="bg-[#FFFBF5]">
      <div className="container-x py-16 md:py-24">
        <SectionHeaderFriendly label={label} heading={heading} scriptAccent={scriptAccent} body={body} />
        <div className="flex flex-wrap gap-3">
          {AREAS.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="inline-flex items-center gap-2 rounded-full border border-[#F0E6DA] bg-white px-4 py-2.5 text-sm font-medium text-[#3D3530] shadow-sm transition-colors hover:border-emerald-600 hover:text-emerald-700"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {a.name}
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/areas"
            className="inline-flex h-12 items-center rounded-2xl border-2 border-emerald-600/40 bg-white px-6 font-display text-sm font-semibold text-[#3D3530] transition-colors hover:border-emerald-600 hover:bg-emerald-50"
          >
            {moreLink}
          </Link>
        </div>
      </div>
    </section>
  )
}
