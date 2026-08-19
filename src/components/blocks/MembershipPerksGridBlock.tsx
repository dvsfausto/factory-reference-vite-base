import { Link } from '@tanstack/react-router'
import { BadgeCheck } from 'lucide-react'
import type { Membership } from './membership-variants'
import { SITE } from '~/data/site'

// Membership LAYOUT: 'perks-grid', benefit-forward: the membership's perks laid
// out as a grid of badge tiles, with the price/CTA in the header. Character-
// agnostic. Distinct from the tier layouts, it sells the membership on its perks,
// not a column of plans. OMIT-WHEN-ABSENT: SITE.memberships via cast; none -> null.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700: emerald-50 perk chips, emerald-600 icon. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned. No bg-brand-*.
export function MembershipPerksGridBlock({
  label = 'Membership',
  heading,
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const memberships = (SITE as { memberships?: Membership[] }).memberships
  if (!memberships || memberships.length === 0) return null
  const m = memberships.find((x) => x.highlighted) ?? memberships[0]!
  const perks = m.perks ?? []
  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
              {heading ?? `${m.name} member perks`}
            </h2>
            {body && <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#64748B]">{body}</p>}
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold tracking-tight text-[#0F172A]">{m.price}</span>
              <span className="text-[#64748B]">{m.period ?? '/month'}</span>
            </div>
            <Link to="/contact" className="inline-flex h-12 items-center rounded-xl bg-primary px-6 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
              Join now
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map((p) => (
            <div key={p} className="flex items-start gap-4 rounded-2xl border border-[#E6E8EC] bg-white p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <span className="pt-2 font-display font-medium text-[#0F172A]">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
