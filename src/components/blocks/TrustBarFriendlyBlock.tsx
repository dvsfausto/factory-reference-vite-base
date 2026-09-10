import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'
import { factIcon } from '~/lib/fact-icons'

// TrustBar VARIANT: 'friendly', the 3 feature points under the hero, warm +
// bright. Soft rounded coral icon chips (NOT round icon-circles, NOT brand
// color), rounded friendly headings, light-warm surface. Left-aligned.
//
// TOKEN DISCIPLINE: emerald-* (DNA → coral) icon chip; light-warm surface
// (#FFFBF5) + charcoal/gray text component-owned; rounded-* (DNA, soft); font-
// display. No brand-* literals, no .btn. Prop signature identical to
// TrustBarBlock; returns an Element (NOT null) to match the default's signature.
export function TrustBarFriendlyBlock({
  items = [],
}: {
  items?: { title: string; description: string; kind?: string | null }[]
}) {
  if (!items.length) return null // no trust facts → no section; never an invented one (niche arc 2b)
  const icons = [ShieldCheck, HeartHandshake, Sparkles]
  return (
    <section className="bg-fam-surface">
      <div className="container-x py-band">
        <div className={`grid grid-cols-1 gap-8 ${items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {items.map((item, i) => {
            const Icon = factIcon(item)
            return (
              <div key={i} className="flex flex-col items-start">
                {Icon && (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fam-accent-soft text-fam-accent-text">
                    <Icon className="h-7 w-7" strokeWidth={2} />
                  </div>
                )}
                <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-fam-ink">
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
