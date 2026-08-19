import { Award, Flame, GlassWater } from 'lucide-react'
import { elegantSurface } from '~/lib/elegant-surface'

// TrustBar VARIANT: 'elegant', the 3 feature points under the hero, refined.
// Surface from elegantSurface(): LIGHT by default, DARK on opt-in (the original
// espresso, byte-identical). Thin emerald-ruled icon marks (no round icon-circles,
// no brand color), refined serif headings, left-aligned for an editorial feel.
//
// TOKEN DISCIPLINE: emerald-* (DNA accent) icon + hairline; surface neutrals from
// elegantSurface(); rounded-* (DNA); font-display (serif). No brand-* literals, no
// .btn. Prop signature identical to TrustBarBlock; returns an Element (NOT null).
export function TrustBarElegantBlock({
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
  const s = elegantSurface()
  const icons = [Flame, GlassWater, Award]
  // Tonal rhythm (elegant only): this band LIFTS to the raised tone, a shelf of
  // trust points under the deep hero, so the homepage reads with intentional
  // depth (hero deep, trustBar raised, the deep services+reviews core, areas
  // raised, cta deep) rather than a flat wall of one tone.
  return (
    <section className={s.sectionAlt}>
      <div className="container-x py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = icons[i] ?? Flame
            return (
              <div key={i} className={`flex flex-col items-start border-t ${s.border} pt-6`}>
                <Icon className="h-7 w-7 text-emerald-600" strokeWidth={1.5} />
                <h3 className={`mt-4 font-display text-xl font-medium tracking-tight ${s.text}`}>
                  {item.title}
                </h3>
                <p className={`mt-2 ${s.muted}`}>{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
