import { Award, Flame, GlassWater } from 'lucide-react'

// TrustBar VARIANT: 'elegant' — the 3 feature points under the hero, dark-luxury.
// Warm-dark surface, thin amber-ruled icon marks (no round icon-circles, no
// brand color), refined serif headings. Left-aligned for an editorial feel.
//
// TOKEN DISCIPLINE: emerald-* (DNA → amber) icon + hairline; warm-dark surface
// (#1A1410) + cream/taupe text component-owned; rounded-* (DNA); font-display
// (serif). No brand-* literals, no .btn. Prop signature identical to
// TrustBarBlock; returns an Element (NOT null) to match the default's signature
// (the return-type parity the bold trust card had to fix).
export function TrustBarElegantBlock({
  items = [
    {
      title: 'Walk-in humidor',
      description: 'A curated, climate-kept selection — from first cigars to rare boxes.',
    },
    {
      title: 'A considered list',
      description: 'Bourbon, rum, and Scotch chosen to pair, poured by people who know them.',
    },
    {
      title: 'Made for lingering',
      description: 'Deep leather, low light, and no one rushing you toward the door.',
    },
  ],
}: {
  items?: { title: string; description: string }[]
}) {
  const icons = [Flame, GlassWater, Award]
  return (
    <section className="bg-[#1A1410]">
      <div className="container-x py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = icons[i] ?? Flame
            return (
              <div key={i} className="flex flex-col items-start border-t border-[#3A2E24] pt-6">
                <Icon className="h-7 w-7 text-emerald-600" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-xl font-medium tracking-tight text-[#F2E8DC]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[#B8A893]">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
