import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { MapPin, Plus, Minus } from 'lucide-react'
import { AREAS } from '~/data/areas'

// Map LAYOUT: 'embed-style-panel', a large panel styled like an embedded map
// (grid texture, faux zoom controls) with the service areas as labelled pins.
// Character-agnostic. OMIT-WHEN-ABSENT: renders from AREAS; none -> null.
//
// HONESTY: a STYLIZED coverage panel, not a real map, pin positions are a
// decorative scatter (no claimed coordinates); only the tier emphasis (home-base)
// is real data. A real embedded map is a later integration.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700: fam-accent home pin. Radius -> rounded-* (DNA). Font ->
// font-display (DNA). Map field (slate-900) component-owned. Never bg-brand-*.
const SPOTS = [
  { top: '24%', left: '28%' }, { top: '38%', left: '68%' }, { top: '60%', left: '36%' },
  { top: '68%', left: '72%' }, { top: '30%', left: '52%' }, { top: '54%', left: '20%' },
]

export function MapEmbedStylePanelBlock({
  areas = AREAS,
  label = tr('section.coverage'),
  heading = tr('section.whereWeWork'),
  body,
}: {
  areas?: typeof AREAS
  label?: string
  heading?: string
  body?: string
}) {
  if (areas.length === 0) return null
  const homeIndex = Math.max(0, areas.findIndex((a) => a.tier === 'home-base'))
  const pins = areas.slice(0, 6)
  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-fam-hairline bg-fam-panel-2">
          <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
          <div className="absolute inset-0 bg-gradient-to-tr from-fam-scrim-2 via-transparent to-fam-accent/10" />
          <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-lg border border-fam-card/15 bg-fam-card/10 backdrop-blur-sm">
            <span className="grid h-8 w-8 place-items-center text-fam-on-dark/80"><Plus className="h-4 w-4" /></span>
            <span className="grid h-8 w-8 place-items-center border-t border-fam-card/15 text-fam-on-dark/80"><Minus className="h-4 w-4" /></span>
          </div>
          {pins.map((a, i) => {
            const isHome = i === homeIndex
            const pos = isHome ? { top: '48%', left: '50%' } : SPOTS[i % SPOTS.length]
            return (
              <div key={a.slug} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: pos!.top, left: pos!.left }}>
                <span className={`inline-flex items-center gap-1.5 rounded-full font-display font-semibold shadow-(--elev-3) backdrop-blur-sm ${isHome ? 'bg-fam-accent px-3.5 py-2 text-sm text-fam-on-accent' : 'bg-fam-card/90 px-3 py-1.5 text-xs text-fam-ink'}`}>
                  <MapPin className={isHome ? 'h-4 w-4' : 'h-3.5 w-3.5 text-fam-accent-text'} /> {a.name}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-8">
          <Link to="/areas" className="inline-flex h-12 items-center rounded-xl bg-cta px-7 font-display text-sm font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)">{tr('section.seeAllAreas')}</Link>
        </div>
      </div>
    </section>
  )
}
