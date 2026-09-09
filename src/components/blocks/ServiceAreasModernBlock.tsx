import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { MapPin } from 'lucide-react'
import { SectionHeaderModern } from '~/components/SectionHeaderModern'
import { AREAS } from '~/data/areas'

// ServiceAreas VARIANT: 'modern', clean area list. SectionHeaderModern (no script)
// + sharp minimal area chips. Prop signature matches ServiceAreasBlock; returns
// Element | null.
//
// TOKEN DISCIPLINE: cool light surface component-owned; emerald-* (DNA → indigo)
// on chip hover + icons; rounded-* (DNA, restrained); font-display. No brand-* /
// .btn.
export function ServiceAreasModernBlock({
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
    <section className="bg-fam-surface-2">
      <div className="container-x py-section">
        <SectionHeaderModern label={label} heading={heading} scriptAccent={scriptAccent} body={body} />
        <div className="flex flex-wrap gap-3">
          {areas.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="inline-flex items-center gap-2 rounded-lg border border-fam-hairline bg-fam-card px-4 py-2.5 text-sm font-medium text-fam-ink transition-colors hover:border-fam-accent hover:text-fam-accent-text-strong"
            >
              <MapPin className="h-3.5 w-3.5 text-fam-accent-text" /> {a.name}
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <Link
            to="/areas"
            className="inline-flex h-12 items-center rounded-xl border border-fam-hairline bg-fam-card px-6 font-display text-sm font-semibold text-fam-ink transition-colors hover:border-fam-accent hover:text-fam-accent-text-strong"
          >
            {moreLink}
          </Link>
        </div>
      </div>
    </section>
  )
}
