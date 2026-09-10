import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { MapPin } from 'lucide-react'
import { AREAS } from '~/data/areas'

// Map LAYOUT: 'split-with-areas', a stylized map panel beside the area list.
// Character-agnostic. OMIT-WHEN-ABSENT: renders from AREAS; none -> null.
//
// HONESTY: stylized coverage panel, no real geography, decorative pin scatter +
// real tier emphasis. Real embedded map is a later integration.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700. Radius -> rounded-* (DNA). Font -> font-display (DNA). Map field
// (slate-900) component-owned. Never bg-brand-* / .btn.
const SPOTS = [
  { top: '26%', left: '30%' }, { top: '40%', left: '66%' }, { top: '62%', left: '38%' },
  { top: '70%', left: '70%' }, { top: '20%', left: '56%' }, { top: '52%', left: '22%' },
]

export function MapSplitWithAreasBlock({
  areas = AREAS,
  label = tr('section.coverage'),
  heading = tr('section.areasWeServe'),
  body = tr('section.proudlyCovering'),
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
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
              <span className="h-px w-6 bg-fam-accent" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
            {body && <p className="mt-4 max-w-md text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
            <div className="mt-7 flex flex-wrap gap-2">
              {areas.slice(0, 10).map((a) => (
                <Link key={a.slug} to="/areas/$slug" params={{ slug: a.slug }} className="inline-flex items-center gap-1.5 rounded-lg border border-fam-hairline px-3 py-1.5 text-sm font-medium text-fam-ink transition-colors hover:border-fam-accent hover:text-fam-accent-text-strong">
                  <MapPin className="h-3.5 w-3.5 text-fam-accent-text" /> {a.name}
                </Link>
              ))}
            </div>
            <Link to="/areas" className="mt-8 inline-flex h-12 items-center rounded-xl bg-cta px-7 font-display text-sm font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)">{tr('common.allAreas')}</Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-fam-hairline bg-fam-panel-2">
            <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-fam-scrim-2 via-transparent to-fam-accent/10" />
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
        </div>
      </div>
    </section>
  )
}
