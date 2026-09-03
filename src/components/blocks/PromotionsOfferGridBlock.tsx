import { Scissors } from 'lucide-react'
import type { Promotion } from './promotions-variants'
import { SITE } from '~/data/site'

// Promotions LAYOUT: 'offer-grid', a denser grid of coupon-style tiles (dashed
// "tear" edge, the code prominent). Character-agnostic. OMIT-WHEN-ABSENT:
// SITE.promotions via cast; none -> null, never fabricates an offer.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700: emerald-600 dashed
// rule + code, emerald-50 wash. Radius -> rounded-* (DNA). Font -> font-display
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
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {promos.slice(0, 6).map((p, i) => (
            <div key={`${p.title}-${i}`} className="overflow-hidden rounded-2xl border-2 border-dashed border-emerald-600 bg-white">
              <div className="bg-emerald-50 px-6 py-4">
                <h3 className="font-display text-lg font-semibold tracking-tight text-[#0F172A]">{p.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-[#475569]">{p.detail}</p>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-dashed border-[#E6E8EC] pt-4">
                  {p.code ? (
                    <span className="inline-flex items-center gap-1.5 font-display text-sm font-semibold tracking-wider text-emerald-700"><Scissors className="h-4 w-4" /> {p.code}</span>
                  ) : <span />}
                  {p.expires && <span className="text-xs text-[#94A3B8]">Ends {p.expires}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
