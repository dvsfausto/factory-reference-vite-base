import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { MapPin } from 'lucide-react'
import { AREAS } from '~/data/areas'

// ServiceAreas LAYOUT: 'map-style' — a coverage panel: the areas as pins on a
// stylized map field beside a text column. Character-agnostic. Evokes a service-
// area map without fabricating geography — the pins are a decorative scatter, and
// the only real emphasis comes from data (a `tier: 'home-base'` area is promoted
// to the central marker).
//
// Honest data use: emphasis is driven by the canonical optional `tier` field, not
// invented coordinates. When no area is tagged home-base, the first area anchors
// the centre. No new field is introduced.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) restricted to 50/100/600/700:
// emerald-600 home pin + markers. Radius -> rounded-* (DNA). Font -> font-display
// (DNA). Map field (slate-900) + light text column component-owned. primary CTA ->
// bg-primary. Never bg-brand-* / .btn.
//
// Prop signature identical to ServiceAreasBlock; returns Element | null.
const SPOTS = [
  { top: '22%', left: '24%' },
  { top: '34%', left: '70%' },
  { top: '62%', left: '32%' },
  { top: '70%', left: '74%' },
  { top: '48%', left: '52%' },
  { top: '18%', left: '56%' },
]

export function ServiceAreasMapStyleBlock({
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
  const homeIndex = Math.max(0, AREAS.findIndex((a) => a.tier === 'home-base'))
  const pins = AREAS.slice(0, 6)
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
              {heading}
            </h2>
            {body && <p className="mt-4 max-w-md text-lg leading-relaxed text-[#64748B]">{body}</p>}
            <div className="mt-7 flex flex-wrap gap-2">
              {AREAS.slice(0, 8).map((a) => (
                <Link
                  key={a.slug}
                  to="/areas/$slug"
                  params={{ slug: a.slug }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#E6E8EC] px-3 py-1.5 text-sm font-medium text-[#0F172A] transition-colors hover:border-emerald-600 hover:text-emerald-700"
                >
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {a.name}
                </Link>
              ))}
            </div>
            <Link
              to="/areas"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {moreLink}
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[#E6E8EC] bg-slate-900">
            <div
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                backgroundSize: '38px 38px',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-transparent to-emerald-600/10" />
            {pins.map((a, i) => {
              const isHome = i === homeIndex
              const pos = isHome ? { top: '48%', left: '50%' } : SPOTS[i % SPOTS.length]
              return (
                <div
                  key={a.slug}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ top: pos!.top, left: pos!.left }}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full font-display font-semibold shadow-lg backdrop-blur-sm ${
                      isHome
                        ? 'bg-emerald-600 px-3.5 py-2 text-sm text-white'
                        : 'bg-white/90 px-3 py-1.5 text-xs text-[#0F172A]'
                    }`}
                  >
                    <MapPin className={isHome ? 'h-4 w-4' : 'h-3.5 w-3.5 text-emerald-600'} />
                    {a.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
