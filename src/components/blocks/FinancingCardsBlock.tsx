import { Link } from '@tanstack/react-router'
import { Wallet } from 'lucide-react'
import type { Financing } from './financing-variants'
import { SITE } from '~/data/site'

// Financing LAYOUT: 'cards', each financing option as its own card. Character-
// agnostic. OMIT-WHEN-ABSENT: SITE.financing via cast; absent -> null, never
// fabricates terms.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700: fam-accent-soft icon chip. Radius -> rounded-* (DNA). Font ->
// font-display (DNA). Light surface component-owned. Never bg-brand-* / .btn.
export function FinancingCardsBlock({
  site = SITE,
  label = 'Financing',
  heading,
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const fin = (site as { financing?: Financing }).financing
  if (!fin) return null
  return (
    <section className="bg-white">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading ?? fin.headline}</h2>
          {fin.partner && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">Flexible plans with {fin.partner}.</p>}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fin.options.map((o, i) => (
            <div key={`${o}-${i}`} className="flex flex-col rounded-2xl border border-fam-hairline bg-white p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-fam-accent-soft text-fam-accent-text"><Wallet className="h-5 w-5" /></span>
              <p className="mt-5 flex-1 font-display text-lg font-medium leading-snug text-fam-ink">{o}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/contact" className="inline-flex h-12 items-center rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">Apply for financing</Link>
        </div>
      </div>
    </section>
  )
}
