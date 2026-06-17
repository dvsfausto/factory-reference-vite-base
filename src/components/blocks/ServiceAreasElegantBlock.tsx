import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import { SectionHeaderElegant } from '~/components/SectionHeaderElegant'
import { AREAS } from '~/data/areas'

// ServiceAreas VARIANT: 'elegant' — dark-luxury area list. Uses SectionHeaderElegant
// (serif, no script) and warm-dark amber-ruled area chips. Prop signature matches
// ServiceAreasBlock; returns Element | null.
//
// TOKEN DISCIPLINE: warm-dark surface component-owned; emerald-* (DNA → amber) on
// the chips' hover + icons; rounded-* (DNA); font-display serif. No brand-* / .btn.
export function ServiceAreasElegantBlock({
  label = 'Where we are',
  heading = 'An easy evening from',
  scriptAccent = 'across the Lowcountry',
  body = 'A short drive, a long stay.',
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
    <section className="bg-[#241C16]">
      <div className="container-x py-20 md:py-28">
        <SectionHeaderElegant label={label} heading={heading} scriptAccent={scriptAccent} body={body} />
        <div className="flex flex-wrap gap-3">
          {AREAS.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="inline-flex items-center gap-2 rounded-lg border border-[#3A2E24] px-4 py-2.5 text-sm text-[#F2E8DC] transition-colors hover:border-emerald-600 hover:text-emerald-100"
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {a.name}
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/areas"
            className="inline-flex h-12 items-center rounded-lg border border-emerald-600/60 px-6 font-display text-sm font-medium uppercase tracking-[0.18em] text-[#F2E8DC] transition-colors hover:border-emerald-600 hover:bg-emerald-600/10"
          >
            {moreLink}
          </Link>
        </div>
      </div>
    </section>
  )
}
