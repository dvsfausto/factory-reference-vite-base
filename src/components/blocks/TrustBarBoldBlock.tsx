import { Clock, Heart, ShieldCheck } from 'lucide-react'

// TrustBar VARIANT: 'bold', the 3 feature-cards under the hero, made bold.
// The default TrustBar renders round icon-circles + text-brand-800 headings
// (soft/elegant). This variant squares the icon containers (rounded-lg, DNA
// radius), uses the emerald accent for the icon (DNA, not brand literal), and
// sets headings in font-display (Oswald). Left-aligned for a structural feel.
//
// TOKEN DISCIPLINE: emerald-* accent (icon chip), rounded-* (square, NOT the
// full-round icon-circle), font-display headings, ink-* neutrals. No brand-*
// literals, no .btn pill. Prop signature identical to TrustBarBlock (icons stay
// fixed in the component, zipped by index, visual identity, not copy).
export function TrustBarBoldBlock({
  items = [],
}: {
  items?: { title: string; description: string }[]
}) {
  if (!items.length) return null // no trust facts → no section; never an invented one (niche arc 2b)
  const icons = [ShieldCheck, Clock, Heart]
  return (
    <section className="container-x py-band">
      <div className={`grid grid-cols-1 gap-8 ${items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        {items.map((item, i) => {
          const Icon = icons[i] ?? ShieldCheck
          return (
            <div key={i} className="flex flex-col items-start">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-fam-accent-soft text-fam-accent-text-strong">
                <Icon className="h-7 w-7" strokeWidth={2} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold uppercase tracking-tight text-ink-900">
                {item.title}
              </h3>
              <p className="mt-2 text-ink-500">{item.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
