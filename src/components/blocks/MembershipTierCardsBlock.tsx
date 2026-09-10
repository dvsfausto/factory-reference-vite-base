import { Link } from '@tanstack/react-router'
import { Check, Star } from 'lucide-react'
import type { Membership } from './membership-variants'
import { SITE } from '~/data/site'

// Membership LAYOUT: 'tier-cards', recurring membership tiers as cards, perks
// listed, a "Become a member" CTA. Character-agnostic. OMIT-WHEN-ABSENT: read from
// optional SITE.memberships via cast; none -> null, never fabricates a plan.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700: fam-accent ring + checks, fam-accent-soft badge. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned. No bg-brand-*.
export function MembershipTierCardsBlock({
  site = SITE,
  label = 'Membership',
  heading = 'Become a member',
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
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-6 md:grid-cols-3">
          {memberships.slice(0, 3).map((m, i) => (
            <div
              key={`${m.name}-${i}`}
              className={`flex flex-col rounded-3xl p-8 ${
                m.highlighted ? 'bg-fam-panel text-fam-on-dark ring-1 ring-fam-accent md:-mt-4 md:pb-12' : 'border border-fam-hairline bg-fam-card'
              }`}
            >
              {m.highlighted && (
                <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-fam-accent-soft px-3 py-1 font-display text-xs font-semibold text-fam-accent-text-strong">
                  <Star className="h-3.5 w-3.5" /> Best value
                </span>
              )}
              <h3 className={`font-display text-lg font-semibold ${m.highlighted ? 'text-fam-on-dark' : 'text-fam-ink'}`}>{m.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`font-display text-4xl font-semibold tracking-tight ${m.highlighted ? 'text-fam-on-dark' : 'text-fam-ink'}`}>{m.price}</span>
                <span className={m.highlighted ? 'text-slate-300' : 'text-fam-ink-muted'}>{m.period ?? '/month'}</span>
              </div>
              {m.perks && m.perks.length > 0 && (
                <ul className="mt-7 flex flex-1 flex-col gap-3 text-sm">
                  {m.perks.map((p) => (
                    <li key={p} className={`flex items-start gap-2.5 ${m.highlighted ? 'text-slate-200' : 'text-fam-ink-muted'}`}>
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-fam-accent-text" /> {p}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to="/contact"
                className={`mt-8 inline-flex h-12 items-center justify-center rounded-xl px-6 font-display text-sm font-semibold transition-opacity hover:opacity-(--hov-fade) ${
                  m.highlighted ? 'bg-cta text-cta-foreground' : 'border border-fam-hairline text-fam-ink hover:border-fam-accent hover:text-fam-accent-text-strong'
                }`}
              >
                Become a member
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
