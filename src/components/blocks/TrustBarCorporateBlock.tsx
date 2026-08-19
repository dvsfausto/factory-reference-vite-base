import { Scale, ShieldCheck, Award } from 'lucide-react'

// TrustBar VARIANT: 'corporate', a structured "why us" value strip. Bordered
// cells, navy line-icons, heavy grotesque headings, dense. No round icon-circles,
// no brand color. Foregrounds credibility, the way professional verticals lead.
//
// TOKEN DISCIPLINE: emerald-* (DNA → navy) icon; structured light surface (white)
// + navy text component-owned + defined borders (#D8DEE7); rounded-* (DNA);
// font-display. No brand-* literals, no .btn. Prop signature identical to
// TrustBarBlock; returns an Element (NOT null).
export function TrustBarCorporateBlock({
  items = [
    {
      title: 'Free estimates',
      description: 'Clear quotes up front, no surprises after the work.',
    },
    {
      title: 'On schedule',
      description: 'We show up when we say we will, and keep you posted.',
    },
    {
      title: 'Local team',
      description: 'Familiar faces and real accountability, close to home.',
    },
  ],
}: {
  items?: { title: string; description: string }[]
}) {
  const icons = [Scale, ShieldCheck, Award]
  return (
    <section className="bg-white">
      <div className="container-x py-14 md:py-16">
        <div className="grid grid-cols-1 divide-y divide-[#D8DEE7] overflow-hidden rounded-lg border border-[#D8DEE7] md:grid-cols-3 md:divide-x md:divide-y-0">
          {items.map((item, i) => {
            const Icon = icons[i] ?? ShieldCheck
            return (
              <div key={i} className="flex flex-col items-start p-7">
                <Icon className="h-7 w-7 text-emerald-600" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-lg font-bold tracking-tight text-[#1A2433]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[#5A6678]">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
