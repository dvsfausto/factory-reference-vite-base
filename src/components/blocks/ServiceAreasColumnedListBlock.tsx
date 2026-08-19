import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { MapPin } from 'lucide-react'
import { AREAS } from '~/data/areas'

// ServiceAreas LAYOUT: 'columned-list', the coverage list set as a multi-column
// directory, the right call when a business serves many neighborhoods: a compact,
// scannable index instead of a sprawling chip cloud. Character-agnostic, no imagery.
//
// Editorial directory (not a stripped grid): balanced text columns, a quiet pin
// per row, generous leading, and a hairline framing the list. Reads like the
// coverage index of a well-set brochure.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700: emerald-600 pin.
// Radius -> rounded-* (DNA). Font -> font-display (DNA). Light surface component-
// owned (white / slate / hairline #E6E8EC). Never bg-brand-* / .btn.
//
// Prop signature identical to ServiceAreasBlock; returns Element | null.
export function ServiceAreasColumnedListBlock({
  label = tr('section.serviceAreas'),
  heading = tr('section.areasWeServe'),
  body = tr('section.proudlyCovering'),
  moreLink = tr('common.allAreas'),
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  moreLink?: string
}) {
  if (AREAS.length === 0) return null
  const areas = AREAS.slice(0, 16)
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>

        <div className="mt-12 gap-x-10 border-t border-[#E6E8EC] pt-4 [column-fill:_balance] sm:columns-2 lg:columns-3 xl:columns-4">
          {areas.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className="group flex break-inside-avoid items-center gap-2 border-b border-[#E6E8EC] py-3 text-[#0F172A] transition-colors hover:text-emerald-700"
            >
              <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="font-display text-base font-medium">{a.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/areas"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {moreLink}
          </Link>
        </div>
      </div>
    </section>
  )
}
