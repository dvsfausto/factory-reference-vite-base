import { Link } from '@tanstack/react-router'
import { ArrowRight, MapPin } from 'lucide-react'
import { AREAS } from '~/data/areas'

// ServiceAreas LAYOUT: 'stacked' — coverage as full-width hairline-separated rows,
// each area set at display scale with its coverage detail and a quiet arrow.
// Character-agnostic, no imagery. Distinct because each area gets the whole width
// and real type weight — a confident coverage index.
//
// Editorial rows (not stretched chips): an oversized area name balanced against a
// compact tier / zip meta column, generous row padding, thin rules between. tier
// and zipCodes are the canonical optional AreaRef fields, shown only when present.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700: emerald-600 pin,
// emerald-700 hover. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light
// surface component-owned (white / slate / hairline #E6E8EC). Never bg-brand-*/.btn.
//
// Prop signature identical to ServiceAreasBlock; returns Element | null.
const TIER_LABEL: Record<string, string> = {
  'home-base': 'Home base',
  primary: 'Primary area',
  secondary: 'Nearby',
}

export function ServiceAreasStackedBlock({
  label = 'Service areas',
  heading = 'Areas we serve',
  body = 'Proudly covering the surrounding communities.',
  moreLink = 'All areas',
}: {
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  moreLink?: string
}) {
  if (AREAS.length === 0) return null
  const rows = AREAS.slice(0, 8)
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

        <div className="mt-12 border-t border-[#E6E8EC]">
          {rows.map((a) => {
            const tier = a.tier ? TIER_LABEL[a.tier] : undefined
            const zips = a.zipCodes?.length ?? 0
            return (
              <Link
                key={a.slug}
                to="/areas/$slug"
                params={{ slug: a.slug }}
                className="group flex items-center justify-between gap-6 border-b border-[#E6E8EC] py-7 transition-colors md:py-9"
              >
                <h3 className="flex items-center gap-3 font-display text-2xl font-semibold tracking-tight text-[#0F172A] transition-colors group-hover:text-emerald-700 md:text-3xl">
                  <MapPin className="h-5 w-5 shrink-0 text-emerald-600" /> {a.name}
                </h3>
                <div className="flex items-center gap-6">
                  <span className="hidden text-right text-sm text-[#64748B] sm:block">
                    {tier && <span className="block font-display font-semibold text-[#0F172A]">{tier}</span>}
                    {zips > 0 && <span>{zips} ZIP codes</span>}
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-emerald-600 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
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
