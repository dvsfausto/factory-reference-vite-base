import { Link } from '@tanstack/react-router'
import { Clock, ArrowRight } from 'lucide-react'
import type { Promotion } from './promotions-variants'
import { SITE } from '~/data/site'

// Promotions LAYOUT: 'countdown-band' — an urgency band for a time-limited offer,
// leading with the real end date. Character-agnostic. OMIT-WHEN-ABSENT:
// SITE.promotions via cast; none -> null, never fabricates an offer.
//
// HONESTY: this shows the real `expires` date as an urgency cue ("Ends {date}") —
// NOT a fake live ticking timer counting toward an invented deadline. If a promo
// has no expires, the band still renders without a countdown line.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-100 on dark.
// primary CTA -> bg-primary. Radius -> rounded-* (DNA). Font -> font-display
// (DNA). Dark band (slate-950) component-owned. Never bg-brand-* / .btn.
export function PromotionsCountdownBandBlock({
  label = 'Limited time',
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const promos = (SITE as { promotions?: Promotion[] }).promotions
  if (!promos || promos.length === 0) return null
  const p = promos[0]!
  return (
    <section className="bg-slate-950 text-white">
      <div className="container-x py-12 md:py-16">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
              <Clock className="h-3.5 w-3.5" /> {label}
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{p.title}</h2>
            <p className="mt-2 text-lg leading-relaxed text-slate-300">{p.detail}</p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
            {p.expires && (
              <span className="rounded-xl bg-white/10 px-5 py-3 text-center font-display backdrop-blur-sm">
                <span className="block text-xs uppercase tracking-[0.16em] text-emerald-100">Hurry — ends</span>
                <span className="mt-0.5 block text-lg font-semibold">{p.expires}</span>
              </span>
            )}
            <Link to="/contact" className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              Claim now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
