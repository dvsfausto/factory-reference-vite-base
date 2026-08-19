import { Link } from '@tanstack/react-router'
import { ArrowRight, Tag } from 'lucide-react'
import type { Promotion } from './promotions-variants'
import { SITE } from '~/data/site'

// Promotions LAYOUT: 'banner', one featured offer as a bold full-width band.
// Character-agnostic. OMIT-WHEN-ABSENT: SITE.promotions via cast; none -> null,
// never fabricates an offer. code/expires shown only when present.
//
// TOKEN DISCIPLINE: the band IS bg-primary / text-primary-foreground (BRAND-owned)
// with an inverted white CTA. code chip on a dashed border. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Never bg-brand-* / .btn.
export function PromotionsBannerBlock({
  label = 'Special offer',
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const promos = (SITE as { promotions?: Promotion[] }).promotions
  if (!promos || promos.length === 0) return null
  const p = promos[0]!
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-x py-12 md:py-16">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/80">
              <Tag className="h-3.5 w-3.5" /> {label}
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{p.title}</h2>
            <p className="mt-2 text-lg leading-relaxed text-primary-foreground/85">{p.detail}</p>
            {p.expires && <p className="mt-2 text-sm text-primary-foreground/70">Ends {p.expires}</p>}
          </div>
          <div className="flex shrink-0 flex-col items-start gap-3 md:items-end">
            {p.code && (
              <span className="rounded-lg border border-dashed border-primary-foreground/50 px-4 py-2 font-display text-sm font-semibold tracking-wider">
                Code: {p.code}
              </span>
            )}
            <Link to="/contact" className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 font-display text-sm font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5">
              Claim offer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
