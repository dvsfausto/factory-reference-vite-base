import { CalendarCheck, ShieldCheck, Sparkles } from 'lucide-react'

// TrustBar VARIANT: 'modern', the 3 feature points under the hero, clean +
// minimal. Plain indigo line-icons (no round icon-circles, no brand color),
// geometric-sans headings, generous whitespace, cool light surface. Left-aligned.
//
// TOKEN DISCIPLINE: emerald-* (DNA → indigo) icon; cool light surface (#F6F7F9) +
// slate text component-owned; rounded-* (DNA); font-display. No brand-* literals,
// no .btn. Prop signature identical to TrustBarBlock; returns an Element (NOT null).
export function TrustBarModernBlock({
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
  const icons = [CalendarCheck, ShieldCheck, Sparkles]
  return (
    <section className="bg-[#F6F7F9]">
      <div className="container-x py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = icons[i] ?? ShieldCheck
            return (
              <div key={i} className="flex flex-col items-start">
                <Icon className="h-7 w-7 text-emerald-600" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-[#0F172A]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[#64748B]">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
