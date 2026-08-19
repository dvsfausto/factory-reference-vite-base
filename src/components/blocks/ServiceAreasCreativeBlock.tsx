import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeaderCreative } from '~/components/SectionHeaderCreative'
import { AREAS } from '~/data/areas'

// ServiceAreas VARIANT: 'creative', bold, expressive area chips. SectionHeaderCreative
// (no script) + big rounded magenta-outline pills that fill magenta on hover.
// Prop signature matches ServiceAreasBlock; returns Element | null.
//
// TOKEN DISCIPLINE: expressive light surface component-owned; emerald-* (DNA →
// magenta) on the pills; rounded-* (DNA, large); font-display. No brand-* / .btn.
export function ServiceAreasCreativeBlock({
  label = ((SITE as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.label ?? tr('section.serviceAreas')),
  heading = ((SITE as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.heading ?? tr('section.whereWeHeading')),
  scriptAccent = ((SITE as { homeAreas?: { label?: string; heading?: string; scriptAccent?: string; body?: string } }).homeAreas?.scriptAccent ?? tr('section.workAccent')),
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
    <section className="bg-[#FBFAFC]">
      <div className="container-x py-20 md:py-28">
        <SectionHeaderCreative label={label} heading={heading} scriptAccent={scriptAccent} body={body} />
        <div className="flex flex-wrap gap-3">
          {AREAS.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="inline-flex items-center gap-2 rounded-full border-2 border-emerald-600 px-5 py-2.5 font-display text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
            >
              {a.name}
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <Link
            to="/areas"
            className="inline-flex h-14 items-center gap-2 rounded-2xl bg-primary px-7 font-display text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {moreLink} <ArrowUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
