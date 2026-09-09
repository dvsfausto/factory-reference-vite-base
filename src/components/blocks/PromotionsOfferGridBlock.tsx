import { Scissors } from 'lucide-react'
import type { Promotion } from './promotions-variants'
import { SITE } from '~/data/site'

// Promotions LAYOUT: 'offer-grid', a denser grid of coupon-style tiles (dashed
// "tear" edge, the code prominent). Character-agnostic. OMIT-WHEN-ABSENT:
// SITE.promotions via cast; none -> null, never fabricates an offer.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700: fam-accent dashed
// rule + code, fam-accent-soft wash. Radius -> rounded-* (DNA). Font -> font-display
// (DNA). Light surface component-owned. Never bg-brand-* / .btn.
export function PromotionsOfferGridBlock({
  site = SITE,
  label = 'Specials',
  heading = 'Offers & coupons',
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const promos = (site as { promotions?: Promotion[] }).promotions
  if (!promos || promos.length === 0) return null
  return (
    <section className="bg-fam-surface-2">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {promos.slice(0, 6).map((p, i) => (
            <div key={`${p.title}-${i}`} className="overflow-hidden rounded-2xl border-2 border-dashed border-fam-accent bg-fam-card">
              <div className="bg-fam-accent-soft px-6 py-4">
                <h3 className="font-display text-lg font-semibold tracking-tight text-fam-ink">{p.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-fam-ink-muted">{p.detail}</p>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-fam-hairline pt-4">
                  {p.code ? (
                    <span className="inline-flex items-center gap-1.5 font-display text-sm font-semibold tracking-wider text-fam-accent-text-strong"><Scissors className="h-4 w-4" /> {p.code}</span>
                  ) : <span />}
                  {p.expires && <span className="text-xs text-fam-ink-faint">Ends {p.expires}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
