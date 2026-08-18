import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { MapPin, Plus, Minus } from 'lucide-react'
import { AREAS } from '~/data/areas'

// Map LAYOUT: 'embed-style-panel' — a large panel styled like an embedded map
// (grid texture, faux zoom controls) with the service areas as labelled pins.
// Character-agnostic. OMIT-WHEN-ABSENT: renders from AREAS; none -> null.
//
// HONESTY: a STYLIZED coverage panel, not a real map — pin positions are a
// decorative scatter (no claimed coordinates); only the tier emphasis (home-base)
// is real data. A real embedded map is a later integration.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700: emerald-600 home pin. Radius -> rounded-* (DNA). Font ->
// font-display (DNA). Map field (slate-900) component-owned. Never bg-brand-*.
const SPOTS = [
  { top: '24%', left: '28%' }, { top: '38%', left: '68%' }, { top: '60%', left: '36%' },
  { top: '68%', left: '72%' }, { top: '30%', left: '52%' }, { top: '54%', left: '20%' },
]

export function MapEmbedStylePanelBlock({
  label = tr('section.coverage'),
  heading = tr('section.whereWeWork'),
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  if (AREAS.length === 0) return null
  const homeIndex = Math.max(0, AREAS.findIndex((a) => a.tier === 'home-base'))
  const pins = AREAS.slice(0, 6)
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-[#E6E8EC] bg-slate-900">
          <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-transparent to-emerald-600/10" />
          <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-lg border border-white/15 bg-white/10 backdrop-blur-sm">
            <span className="grid h-8 w-8 place-items-center text-white/80"><Plus className="h-4 w-4" /></span>
            <span className="grid h-8 w-8 place-items-center border-t border-white/15 text-white/80"><Minus className="h-4 w-4" /></span>
          </div>
          {pins.map((a, i) => {
            const isHome = i === homeIndex
            const pos = isHome ? { top: '48%', left: '50%' } : SPOTS[i % SPOTS.length]
            return (
              <div key={a.slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: pos!.top, left: pos!.left }}>
                <span className={`inline-flex items-center gap-1.5 rounded-full font-display font-semibold shadow-lg backdrop-blur-sm ${isHome ? 'bg-emerald-600 px-3.5 py-2 text-sm text-white' : 'bg-white/90 px-3 py-1.5 text-xs text-[#0F172A]'}`}>
                  <MapPin className={isHome ? 'h-4 w-4' : 'h-3.5 w-3.5 text-emerald-600'} /> {a.name}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-8">
          <Link to="/areas" className="inline-flex h-12 items-center rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">{tr('section.seeAllAreas')}</Link>
        </div>
      </div>
    </section>
  )
}
