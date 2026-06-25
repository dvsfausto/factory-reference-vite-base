import { Link } from '@tanstack/react-router'
import { Check, Minus } from 'lucide-react'
import type { Membership } from './membership-variants'
import { SITE } from '~/data/site'

// Membership LAYOUT: 'comparison' — a perk matrix across membership tiers (perks
// as rows, tiers as columns). Character-agnostic. OMIT-WHEN-ABSENT: SITE.memberships
// via cast; none -> null. The perk universe is derived from the data only.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700: emerald-600 checks, emerald-50 highlighted column. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned.
export function MembershipComparisonBlock({
  label = 'Membership',
  heading = 'Compare memberships',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const memberships = (SITE as { memberships?: Membership[] }).memberships
  if (!memberships || memberships.length === 0) return null
  const cols = memberships.slice(0, 4)
  const allPerks: string[] = []
  for (const m of cols) for (const p of m.perks ?? []) if (!allPerks.includes(p)) allPerks.push(p)
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
        <div className="mt-12 overflow-x-auto rounded-2xl border border-[#E6E8EC] bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E6E8EC]">
                <th className="p-6" />
                {cols.map((m, i) => (
                  <th key={`${m.name}-${i}`} className={`p-6 align-bottom ${m.highlighted ? 'bg-emerald-50' : ''}`}>
                    <div className="font-display text-base font-semibold text-[#0F172A]">{m.name}</div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-2xl font-semibold tracking-tight text-[#0F172A]">{m.price}</span>
                      <span className="text-sm text-[#64748B]">{m.period ?? '/mo'}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPerks.map((perk) => (
                <tr key={perk} className="border-b border-[#E6E8EC] last:border-0">
                  <td className="p-5 text-sm font-medium text-[#475569]">{perk}</td>
                  {cols.map((m, i) => (
                    <td key={`${m.name}-${i}`} className={`p-5 ${m.highlighted ? 'bg-emerald-50' : ''}`}>
                      {(m.perks ?? []).includes(perk) ? <Check className="h-5 w-5 text-emerald-600" /> : <Minus className="h-5 w-5 text-[#CBD5E1]" />}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-5" />
                {cols.map((m, i) => (
                  <td key={`${m.name}-${i}`} className={`p-5 ${m.highlighted ? 'bg-emerald-50' : ''}`}>
                    <Link to="/contact" className={`inline-flex h-11 items-center justify-center rounded-xl px-5 font-display text-sm font-semibold transition-opacity hover:opacity-90 ${m.highlighted ? 'bg-primary text-primary-foreground' : 'border border-[#E6E8EC] text-[#0F172A] hover:border-emerald-600'}`}>Join</Link>
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
