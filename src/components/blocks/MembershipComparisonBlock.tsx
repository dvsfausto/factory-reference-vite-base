import { Link } from '@tanstack/react-router'
import { Check, Minus } from 'lucide-react'
import type { Membership } from './membership-variants'
import { SITE } from '~/data/site'

// Membership LAYOUT: 'comparison', a perk matrix across membership tiers (perks
// as rows, tiers as columns). Character-agnostic. OMIT-WHEN-ABSENT: SITE.memberships
// via cast; none -> null. The perk universe is derived from the data only.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA)
// 50/100/600/700: fam-accent checks, fam-accent-soft highlighted column. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned.
export function MembershipComparisonBlock({
  site = SITE,
  label = 'Membership',
  heading = 'Compare memberships',
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const memberships = (site as { memberships?: Membership[] }).memberships
  if (!memberships || memberships.length === 0) return null
  const cols = memberships.slice(0, 4)
  const allPerks: string[] = []
  for (const m of cols) for (const p of m.perks ?? []) if (!allPerks.includes(p)) allPerks.push(p)
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
        <div className="mt-12 overflow-x-auto rounded-2xl border border-fam-hairline bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-fam-hairline">
                <th className="p-6" />
                {cols.map((m, i) => (
                  <th key={`${m.name}-${i}`} className={`p-6 align-bottom ${m.highlighted ? 'bg-fam-accent-soft' : ''}`}>
                    <div className="font-display text-base font-semibold text-fam-ink">{m.name}</div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-2xl font-semibold tracking-tight text-fam-ink">{m.price}</span>
                      <span className="text-sm text-fam-ink-muted">{m.period ?? '/mo'}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPerks.map((perk) => (
                <tr key={perk} className="border-b border-fam-hairline last:border-0">
                  <td className="p-5 text-sm font-medium text-fam-ink-muted">{perk}</td>
                  {cols.map((m, i) => (
                    <td key={`${m.name}-${i}`} className={`p-5 ${m.highlighted ? 'bg-fam-accent-soft' : ''}`}>
                      {(m.perks ?? []).includes(perk) ? <Check className="h-5 w-5 text-fam-accent-text" /> : <Minus className="h-5 w-5 text-[#CBD5E1]" />}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-5" />
                {cols.map((m, i) => (
                  <td key={`${m.name}-${i}`} className={`p-5 ${m.highlighted ? 'bg-fam-accent-soft' : ''}`}>
                    <Link to="/contact" className={`inline-flex h-11 items-center justify-center rounded-xl px-5 font-display text-sm font-semibold transition-opacity hover:opacity-90 ${m.highlighted ? 'bg-primary text-primary-foreground' : 'border border-fam-hairline text-fam-ink hover:border-fam-accent'}`}>Join</Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
