import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { MapPin } from 'lucide-react'
import { SectionHeaderCorporate } from '~/components/SectionHeaderCorporate'
import { AREAS } from '~/data/areas'

// ServiceAreas VARIANT: 'corporate', a structured list of areas/jurisdictions
// served. SectionHeaderCorporate (no script) + bordered, boxed area cells. Prop
// signature matches ServiceAreasBlock; returns Element | null.
//
// TOKEN DISCIPLINE: structured light surface component-owned; emerald-* (DNA →
// navy) on hover + icons; rounded-* (DNA, tight); font-display. No brand-* / .btn.
export function ServiceAreasCorporateBlock({
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
    <section className="bg-white">
      <div className="container-x py-16 md:py-20">
        <SectionHeaderCorporate label={label} heading={heading} scriptAccent={scriptAccent} body={body} />
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#D8DEE7] bg-[#D8DEE7] sm:grid-cols-3 lg:grid-cols-4">
          {AREAS.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="group inline-flex items-center gap-2 bg-white px-5 py-4 text-sm font-semibold text-[#1A2433] transition-colors hover:bg-[#FAFBFC] hover:text-emerald-700"
            >
              <MapPin className="h-4 w-4 text-emerald-600" /> {a.name}
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/areas"
            className="inline-flex h-12 items-center rounded-md border border-[#D8DEE7] px-6 font-display text-sm font-semibold text-[#1A2433] transition-colors hover:border-emerald-600 hover:text-emerald-700"
          >
            {moreLink}
          </Link>
        </div>
      </div>
    </section>
  )
}
