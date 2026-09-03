import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { ArrowRight, MapPin } from 'lucide-react'
import { AREAS } from '~/data/areas'
import { areaImageUrl } from '~/data/images'

// ServiceAreas LAYOUT: 'cards', each area as a composed image card with a tier
// badge and coverage detail, rather than a bare chip. Character-agnostic. Gives
// each neighborhood a sense of place and makes coverage feel substantial.
//
// Composed, not stripped: a photo (areaImageUrl, slug-resolved with a hero
// fallback so a photo-less area still renders), a name, an optional tier badge,
// and an optional zip-count line. tier and zipCodes are the canonical optional
// AreaRef fields, shown only when present, never fabricated.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700: emerald-50 badge,
// emerald-600 accent. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light
// surface component-owned (white / slate / #E6E8EC). Never bg-brand-* / .btn.
//
// Prop signature identical to ServiceAreasBlock; returns Element | null.
const TIER_LABEL: Record<string, string> = {
  'home-base': 'Home base',
  primary: 'Primary area',
  secondary: 'Nearby',
}

export function ServiceAreasCardsBlock({
  areas = AREAS,
  label = tr('section.serviceAreas'),
  heading = tr('section.areasWeServe'),
  body = tr('section.proudlyCovering'),
  moreLink = tr('common.allAreas'),
}: {
  areas?: typeof AREAS
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  moreLink?: string
}) {
  if (areas.length === 0) return null
  const cards = areas.slice(0, 6)
  return (
    <section className="bg-[#F8FAFC]">
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

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((a) => {
            const tier = a.tier ? TIER_LABEL[a.tier] : undefined
            const zips = a.zipCodes?.length ?? 0
            return (
              <Link
                key={a.slug}
                to="/areas/$slug"
                params={{ slug: a.slug }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white transition-all hover:border-emerald-600 hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={areaImageUrl(a.slug)}
                    alt={a.name}
                    loading="lazy"
                    width={800}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {tier && (
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-50 px-3 py-1 font-display text-xs font-semibold text-emerald-700">
                      {tier}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 items-center justify-between gap-3 p-6">
                  <div>
                    <h3 className="flex items-center gap-1.5 font-display text-lg font-semibold tracking-tight text-[#0F172A]">
                      <MapPin className="h-4 w-4 text-emerald-600" /> {a.name}
                    </h3>
                    {zips > 0 && (
                      <p className="mt-1 text-sm text-[#64748B]">{zips} ZIP codes covered</p>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-emerald-600 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-12">
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
