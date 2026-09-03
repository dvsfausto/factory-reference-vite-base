import { MapPin } from 'lucide-react'
import { tr } from '~/lib/i18n'
import { AREAS } from '~/data/areas'

// Map LAYOUT: 'full-width-band', a full-width map-textured band with the heading
// overlaid and area names as labels across it. Character-agnostic. OMIT-WHEN-
// ABSENT: renders from AREAS; none -> null.
//
// HONESTY: stylized coverage band, no real geography, decorative labels + real
// tier emphasis. Real embedded map is a later integration.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-100 eyebrow,
// emerald-600 home label. Radius -> rounded-* (DNA). Font -> font-display (DNA).
// Map field (slate-950) component-owned. No CTA by design. Never bg-brand-*.
export function MapFullWidthBandBlock({
  areas = AREAS,
  label = tr('section.coverage'),
  heading = tr('section.servingWholeArea'),
  body,
}: {
  areas?: typeof AREAS
  label?: string
  heading?: string
  body?: string
}) {
  if (areas.length === 0) return null
  const homeIndex = Math.max(0, areas.findIndex((a) => a.tier === 'home-base'))
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      <div className="container-x relative py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-slate-300">{body}</p>}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          {areas.slice(0, 12).map((a, i) => (
            <span key={a.slug} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-sm font-semibold backdrop-blur-sm ${i === homeIndex ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white'}`}>
              <MapPin className={`h-4 w-4 ${i === homeIndex ? 'text-white' : 'text-emerald-100'}`} /> {a.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
