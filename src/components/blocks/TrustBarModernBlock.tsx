import { CalendarCheck, ShieldCheck, Sparkles } from 'lucide-react'

// TrustBar VARIANT: 'modern', the 3 feature points under the hero, clean +
// minimal. Plain indigo line-icons (no round icon-circles, no brand color),
// geometric-sans headings, generous whitespace, cool light surface. Left-aligned.
//
// TOKEN DISCIPLINE: emerald-* (DNA → indigo) icon; cool light surface (#F6F7F9) +
// slate text component-owned; rounded-* (DNA); font-display. No brand-* literals,
// no .btn. Prop signature identical to TrustBarBlock; returns an Element (NOT null).
export function TrustBarModernBlock({
  items = [],
}: {
  items?: { title: string; description: string }[]
}) {
  if (!items.length) return null // no trust facts → no section; never an invented one (niche arc 2b)
  const icons = [CalendarCheck, ShieldCheck, Sparkles]
  return (
    <section className="bg-fam-surface-2">
      <div className="container-x py-band">
        <div className={`grid grid-cols-1 gap-10 ${items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {items.map((item, i) => {
            const Icon = icons[i] ?? ShieldCheck
            return (
              <div key={i} className="flex flex-col items-start">
                <Icon className="h-7 w-7 text-fam-accent-text" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-fam-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-fam-ink-muted">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
