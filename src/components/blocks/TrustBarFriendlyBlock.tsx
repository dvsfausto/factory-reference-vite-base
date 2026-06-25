import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react'

// TrustBar VARIANT: 'friendly' — the 3 feature points under the hero, warm +
// bright. Soft rounded coral icon chips (NOT round icon-circles, NOT brand
// color), rounded friendly headings, light-warm surface. Left-aligned.
//
// TOKEN DISCIPLINE: emerald-* (DNA → coral) icon chip; light-warm surface
// (#FFFBF5) + charcoal/gray text component-owned; rounded-* (DNA, soft); font-
// display. No brand-* literals, no .btn. Prop signature identical to
// TrustBarBlock; returns an Element (NOT null) to match the default's signature.
export function TrustBarFriendlyBlock({
  items = [
    {
      title: 'Licensed & accredited',
      description: 'Vetted, qualified teachers and a program parents can trust.',
    },
    {
      title: 'Small class sizes',
      description: 'More attention for every child, every single day.',
    },
    {
      title: 'Safe & nurturing',
      description: 'A warm, secure space where kids feel happy to learn.',
    },
  ],
}: {
  items?: { title: string; description: string }[]
}) {
  const icons = [ShieldCheck, HeartHandshake, Sparkles]
  return (
    <section className="bg-[#FFFBF5]">
      <div className="container-x py-14 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = icons[i] ?? ShieldCheck
            return (
              <div key={i} className="flex flex-col items-start">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon className="h-7 w-7" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-[#3D3530]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[#7A6F66]">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
