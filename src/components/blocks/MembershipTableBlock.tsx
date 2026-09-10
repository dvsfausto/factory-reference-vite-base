import { Link } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'
import type { Membership } from './membership-variants'
import { SITE } from '~/data/site'

// Membership LAYOUT: 'table', compact hairline rows, one membership per line with
// price + inline perks + a join action. Character-agnostic. The dense, scannable
// option. OMIT-WHEN-ABSENT: SITE.memberships via cast; none -> null.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700: fam-accent checks, fam-accent-soft highlighted row. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned.
export function MembershipTableBlock({
  site = SITE,
  label = 'Membership',
  heading = 'Membership options',
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const memberships = (site as { memberships?: Membership[] }).memberships
  if (!memberships || memberships.length === 0) return null
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
        <div className="mt-12 overflow-hidden rounded-2xl border border-fam-hairline">
          {memberships.map((m, i) => (
            <div key={`${m.name}-${i}`} className={`grid grid-cols-1 items-center gap-4 border-b border-fam-hairline p-6 last:border-0 md:grid-cols-12 md:gap-6 ${m.highlighted ? 'bg-fam-accent-soft' : 'bg-fam-card'}`}>
              <div className="md:col-span-3">
                <h3 className="font-display text-lg font-semibold text-fam-ink">{m.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-display text-2xl font-semibold tracking-tight text-fam-ink">{m.price}</span>
                  <span className="text-sm text-fam-ink-muted">{m.period ?? '/mo'}</span>
                </div>
              </div>
              <div className="md:col-span-7">
                {m.perks && m.perks.length > 0 && (
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-fam-ink-muted">
                    {m.perks.map((p) => (
                      <li key={p} className="inline-flex items-center gap-1.5">
                        <Check className="h-4 w-4 shrink-0 text-fam-accent-text" /> {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="md:col-span-2 md:text-right">
                <Link to="/contact" className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-cta px-5 font-display text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-(--hov-fade)">
                  Join <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
