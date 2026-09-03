import { Link } from '@tanstack/react-router'
import { ArrowRight, Check } from 'lucide-react'
import type { Membership } from './membership-variants'
import { SITE } from '~/data/site'

// Membership LAYOUT: 'table', compact hairline rows, one membership per line with
// price + inline perks + a join action. Character-agnostic. The dense, scannable
// option. OMIT-WHEN-ABSENT: SITE.memberships via cast; none -> null.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700: emerald-600 checks, emerald-50 highlighted row. Radius ->
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
        <div className="mt-12 overflow-hidden rounded-2xl border border-[#E6E8EC]">
          {memberships.map((m, i) => (
            <div key={`${m.name}-${i}`} className={`grid grid-cols-1 items-center gap-4 border-b border-[#E6E8EC] p-6 last:border-0 md:grid-cols-12 md:gap-6 ${m.highlighted ? 'bg-emerald-50' : 'bg-white'}`}>
              <div className="md:col-span-3">
                <h3 className="font-display text-lg font-semibold text-[#0F172A]">{m.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-display text-2xl font-semibold tracking-tight text-[#0F172A]">{m.price}</span>
                  <span className="text-sm text-[#64748B]">{m.period ?? '/mo'}</span>
                </div>
              </div>
              <div className="md:col-span-7">
                {m.perks && m.perks.length > 0 && (
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#475569]">
                    {m.perks.map((p) => (
                      <li key={p} className="inline-flex items-center gap-1.5">
                        <Check className="h-4 w-4 shrink-0 text-emerald-600" /> {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="md:col-span-2 md:text-right">
                <Link to="/contact" className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-primary px-5 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
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
