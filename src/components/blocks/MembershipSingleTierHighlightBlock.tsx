import { Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import type { Membership } from './membership-variants'
import { SITE } from '~/data/site'

// Membership LAYOUT: 'single-tier-highlight', one membership as a wide bold panel
// (the common single-membership case). Character-agnostic. OMIT-WHEN-ABSENT:
// SITE.memberships via cast; none -> null. Picks the highlighted membership else
// the first.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700: emerald-100 checks on dark. Radius -> rounded-* (DNA). Font ->
// font-display (DNA). Dark panel (slate-950) component-owned. No bg-brand-*.
export function MembershipSingleTierHighlightBlock({
  label = 'Membership',
  heading = 'Join the membership',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const memberships = (SITE as { memberships?: Membership[] }).memberships
  if (!memberships || memberships.length === 0) return null
  const m = memberships.find((x) => x.highlighted) ?? memberships[0]!
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>
        <div className="mt-12 overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
          <div className="grid gap-8 p-8 md:grid-cols-5 md:p-12">
            <div className="md:col-span-2 md:border-r md:border-white/10 md:pr-10">
              <h3 className="font-display text-2xl font-semibold">{m.name}</h3>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-6xl font-semibold tracking-tight">{m.price}</span>
                <span className="text-slate-300">{m.period ?? '/month'}</span>
              </div>
              <Link to="/contact" className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                Become a member
              </Link>
            </div>
            {m.perks && m.perks.length > 0 && (
              <ul className="grid gap-3 text-sm md:col-span-3 md:grid-cols-2">
                {m.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-slate-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-100" /> {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
