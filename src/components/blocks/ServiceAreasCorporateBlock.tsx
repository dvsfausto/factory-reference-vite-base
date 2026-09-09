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
  site = SITE,
  areas = AREAS,
  label = ((site as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.label ?? tr('section.serviceAreas')),
  heading = ((site as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.heading ?? tr('section.whereWeHeading')),
  scriptAccent = ((site as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.scriptAccent ?? tr('section.workAccent')),
  body = ((site as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.body ?? 'Local coverage, close to home.'),
  moreLink = tr('common.allAreas'),
}: {
  site?: typeof SITE
  areas?: typeof AREAS
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  moreLink?: string
}) {
  if (areas.length === 0) return null
  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <SectionHeaderCorporate label={label} heading={heading} scriptAccent={scriptAccent} body={body} />
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-fam-hairline bg-fam-hairline sm:grid-cols-3 lg:grid-cols-4">
          {areas.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="group inline-flex items-center gap-2 bg-fam-card px-5 py-4 text-sm font-semibold text-fam-ink transition-colors hover:bg-fam-surface-5 hover:text-fam-accent-text-strong"
            >
              <MapPin className="h-4 w-4 text-fam-accent-text" /> {a.name}
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/areas"
            className="inline-flex h-12 items-center rounded-md border border-fam-hairline px-6 font-display text-sm font-semibold text-fam-ink transition-colors hover:border-fam-accent hover:text-fam-accent-text-strong"
          >
            {moreLink}
          </Link>
        </div>
      </div>
    </section>
  )
}
