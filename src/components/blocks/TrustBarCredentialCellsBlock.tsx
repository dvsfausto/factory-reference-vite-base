import { ShieldCheck, Clock, Heart, Award, BadgeCheck, Star, type LucideIcon } from 'lucide-react'
import { factIcon } from '~/lib/fact-icons'

// TrustBar LAYOUT: 'credential-cells', each trust point set in its own bordered
// cell, joined into a single framed band (shared hairlines, like a credentials
// table). Character-agnostic. Composed and structured, reads as formal proof
// rather than a loose icon row.
//
// Considered cells (not a stripped grid): a fixed line-icon, a bold title, and a
// supporting line per cell, with shared hairline dividers that knit the cells into
// one object. Icons are fixed visual identity (zipped by index), not copy.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) restricted to 50/100/600/700:
// fam-accent-soft icon chip, fam-accent icon. Radius -> rounded-* (DNA). Font ->
// font-display (DNA). Cool light surface component-owned (section #F6F7F9, white
// cells, hairline #E6E8EC, slate text). No CTA by design. Never bg-brand-* / .btn.
//
// Prop signature identical to TrustBarBlock; returns an Element (no null).
const ICONS: LucideIcon[] = [ShieldCheck, Clock, Heart, Award, BadgeCheck, Star]

export function TrustBarCredentialCellsBlock({
  items = [],
}: {
  items?: { title: string; description: string; kind?: string | null }[]
}) {
  if (!items.length) return null // no trust facts → no section; never an invented one (niche arc 2b)
  return (
    <section className="bg-fam-surface-2">
      <div className="container-x py-band">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-fam-hairline bg-fam-hairline sm:grid-cols-3">
          {items.map((item, i) => {
            const Icon = factIcon(item)
            return (
              <div key={i} className="flex flex-col bg-fam-card p-7">
                {Icon && (
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-fam-accent-soft text-fam-accent-text">
                    <Icon className="h-5 w-5" strokeWidth={1.9} />
                  </span>
                )}
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-fam-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fam-ink-muted">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
