import { Link } from '@tanstack/react-router'
import { Tag } from 'lucide-react'
import type { Promotion } from './promotions-variants'
import { SITE } from '~/data/site'

// Promotions LAYOUT: 'cards', a few clean offer cards (detail + code + expiry +
// claim). Character-agnostic. OMIT-WHEN-ABSENT: SITE.promotions via cast; none ->
// null, never fabricates an offer.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700: fam-accent-soft tag chip, fam-accent accent. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned. Never
// bg-brand-* / .btn.
export function PromotionsCardsBlock({
  site = SITE,
  label = 'Specials',
  heading = 'Current offers',
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
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {promos.slice(0, 3).map((p, i) => (
            <div key={`${p.title}-${i}`} className="flex flex-col rounded-2xl border border-fam-hairline bg-fam-card p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-fam-accent-soft text-fam-accent-text"><Tag className="h-5 w-5" /></span>
              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-fam-ink">{p.title}</h3>
              <p className="mt-2 flex-1 leading-relaxed text-fam-ink-muted">{p.detail}</p>
              {p.code && <span className="mt-5 w-fit rounded-lg border border-dashed border-fam-accent px-3 py-1.5 font-display text-sm font-semibold tracking-wider text-fam-accent-text-strong">Code: {p.code}</span>}
              {p.expires && <span className="mt-3 text-xs text-fam-ink-faint">Ends {p.expires}</span>}
              <Link to="/contact" className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-cta px-5 font-display text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-90">Claim offer</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
