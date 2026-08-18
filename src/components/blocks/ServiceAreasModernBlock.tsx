import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { MapPin } from 'lucide-react'
import { SectionHeaderModern } from '~/components/SectionHeaderModern'
import { AREAS } from '~/data/areas'

// ServiceAreas VARIANT: 'modern' — clean area list. SectionHeaderModern (no script)
// + sharp minimal area chips. Prop signature matches ServiceAreasBlock; returns
// Element | null.
//
// TOKEN DISCIPLINE: cool light surface component-owned; emerald-* (DNA → indigo)
// on chip hover + icons; rounded-* (DNA, restrained); font-display. No brand-* /
// .btn.
export function ServiceAreasModernBlock({
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
    <section className="bg-[#F6F7F9]">
      <div className="container-x py-20 md:py-28">
        <SectionHeaderModern label={label} heading={heading} scriptAccent={scriptAccent} body={body} />
        <div className="flex flex-wrap gap-3">
          {AREAS.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="inline-flex items-center gap-2 rounded-lg border border-[#E6E8EC] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:border-emerald-600 hover:text-emerald-700"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {a.name}
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <Link
            to="/areas"
            className="inline-flex h-12 items-center rounded-xl border border-[#E6E8EC] bg-white px-6 font-display text-sm font-semibold text-[#0F172A] transition-colors hover:border-emerald-600 hover:text-emerald-700"
          >
            {moreLink}
          </Link>
        </div>
      </div>
    </section>
  )
}
