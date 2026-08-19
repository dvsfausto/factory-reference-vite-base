import { Link } from '@tanstack/react-router'
import { Tag } from 'lucide-react'
import type { Promotion } from './promotions-variants'
import { SITE } from '~/data/site'

// Promotions LAYOUT: 'cards', a few clean offer cards (detail + code + expiry +
// claim). Character-agnostic. OMIT-WHEN-ABSENT: SITE.promotions via cast; none ->
// null, never fabricates an offer.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700: emerald-50 tag chip, emerald-600 accent. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned. Never
// bg-brand-* / .btn.
export function PromotionsCardsBlock({
  label = 'Specials',
  heading = 'Current offers',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const promos = (SITE as { promotions?: Promotion[] }).promotions
  if (!promos || promos.length === 0) return null
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
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {promos.slice(0, 3).map((p, i) => (
            <div key={`${p.title}-${i}`} className="flex flex-col rounded-2xl border border-[#E6E8EC] bg-white p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><Tag className="h-5 w-5" /></span>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-[#0F172A]">{p.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed text-[#64748B]">{p.detail}</p>
              {p.code && <span className="mt-5 w-fit rounded-lg border border-dashed border-emerald-600 px-3 py-1.5 font-display text-sm font-semibold tracking-wider text-emerald-700">Code: {p.code}</span>}
              {p.expires && <span className="mt-3 text-xs text-[#94A3B8]">Ends {p.expires}</span>}
              <Link to="/contact" className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">Claim offer</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
