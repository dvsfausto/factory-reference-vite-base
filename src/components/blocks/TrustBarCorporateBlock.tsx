import { Scale, ShieldCheck, Award } from 'lucide-react'
import { factIcon } from '~/lib/fact-icons'

// TrustBar VARIANT: 'corporate', a structured "why us" value strip. Bordered
// cells, navy line-icons, heavy grotesque headings, dense. No round icon-circles,
// no brand color. Foregrounds credibility, the way professional verticals lead.
//
// TOKEN DISCIPLINE: emerald-* (DNA → navy) icon; structured light surface (white)
// + navy text component-owned + defined borders (#D8DEE7); rounded-* (DNA);
// font-display. No brand-* literals, no .btn. Prop signature identical to
// TrustBarBlock; returns an Element (NOT null).
export function TrustBarCorporateBlock({
  items = [],
}: {
  items?: { title: string; description: string; kind?: string | null }[]
}) {
  if (!items.length) return null // no trust facts → no section; never an invented one (niche arc 2b)
  const icons = [Scale, ShieldCheck, Award]
  return (
    <section className="bg-fam-card">
      <div className="container-x py-band">
        <div className="grid grid-cols-1 divide-y divide-fam-hairline overflow-hidden rounded-lg border border-fam-hairline md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((item, i) => {
            const Icon = factIcon(item)
            return (
              <div key={i} className="flex flex-col items-start p-7">
                {Icon && <Icon className="h-7 w-7 text-fam-accent-text" strokeWidth={1.75} />}
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-fam-ink">
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
