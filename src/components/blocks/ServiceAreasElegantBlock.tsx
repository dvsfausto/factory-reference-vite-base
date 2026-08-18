import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { MapPin } from 'lucide-react'
import { SectionHeaderElegant } from '~/components/SectionHeaderElegant'
import { elegantSurface } from '~/lib/elegant-surface'
import { AREAS } from '~/data/areas'

// ServiceAreas VARIANT: 'elegant' — refined area list. SectionHeaderElegant (serif,
// no script) + emerald-ruled area chips. Surface from elegantSurface() — this
// section sits on the ALT tone (leather in dark, warm tint in light). Prop
// signature matches ServiceAreasBlock; returns Element | null.
//
// TOKEN DISCIPLINE: surface neutrals from elegantSurface(); emerald-* (DNA accent)
// on the chips' hover + icons; rounded-* (DNA); font-display serif. No brand-* /
// .btn.
export function ServiceAreasElegantBlock({
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
  const s = elegantSurface()
  if (AREAS.length === 0) return null
  return (
    <section className={s.sectionAlt}>
      <div className="container-x py-20 md:py-28">
        <SectionHeaderElegant label={label} heading={heading} scriptAccent={scriptAccent} body={body} />
        <div className="flex flex-wrap gap-3">
          {AREAS.map((a) => (
            <Link
              key={a.slug}
              to="/areas/$slug"
              params={{ slug: a.slug }}
              className={`inline-flex items-center gap-2 rounded-lg border ${s.border} px-4 py-2.5 text-sm ${s.text} transition-colors hover:border-emerald-600 hover:text-emerald-100`}
            >
              <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {a.name}
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link
            to="/areas"
            className={`inline-flex h-12 items-center rounded-lg border border-emerald-600/60 px-6 font-display text-sm font-medium uppercase tracking-[0.18em] ${s.text} transition-colors hover:border-emerald-600 hover:bg-emerald-600/10`}
          >
            {moreLink}
          </Link>
        </div>
      </div>
    </section>
  )
}
