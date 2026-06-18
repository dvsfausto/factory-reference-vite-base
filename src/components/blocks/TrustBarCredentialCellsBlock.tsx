import { ShieldCheck, Clock, Heart, Award, BadgeCheck, Star, type LucideIcon } from 'lucide-react'

// TrustBar LAYOUT: 'credential-cells' — each trust point set in its own bordered
// cell, joined into a single framed band (shared hairlines, like a credentials
// table). Character-agnostic. Composed and structured — reads as formal proof
// rather than a loose icon row.
//
// Considered cells (not a stripped grid): a fixed line-icon, a bold title, and a
// supporting line per cell, with shared hairline dividers that knit the cells into
// one object. Icons are fixed visual identity (zipped by index), not copy.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) restricted to 50/100/600/700:
// emerald-50 icon chip, emerald-600 icon. Radius -> rounded-* (DNA). Font ->
// font-display (DNA). Cool light surface component-owned (section #F6F7F9, white
// cells, hairline #E6E8EC, slate text). No CTA by design. Never bg-brand-* / .btn.
//
// Prop signature identical to TrustBarBlock; returns an Element (no null).
const ICONS: LucideIcon[] = [ShieldCheck, Clock, Heart, Award, BadgeCheck, Star]

export function TrustBarCredentialCellsBlock({
  items = [
    { title: 'Licensed & insured', description: 'Professional team with proper credentials and coverage.' },
    { title: 'Same-day quotes', description: 'We reply within a business day, often the same day.' },
    { title: 'Local team', description: 'Familiar faces, familiar streets, real accountability.' },
  ],
}: {
  items?: { title: string; description: string }[]
}) {
  return (
    <section className="bg-[#F6F7F9]">
      <div className="container-x py-14 md:py-16">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[#E6E8EC] bg-[#E6E8EC] sm:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length]!
            return (
              <div key={i} className="flex flex-col bg-white p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-[#0F172A]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
