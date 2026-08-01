import { motion, useReducedMotion } from 'framer-motion'
import { SITE } from '~/data/site'

// TRUST BAR VARIANT: 'hairline-rows' — the real trust items in a sleek row,
// divided by brand hairlines over a faint brand tint. Each item is led by a
// slim vertical brand-gradient accent mark; items stagger in as they enter.
// The flat, editorial counterpart to the tactile 'glow-cards' variant.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-tint       → the section's faint brand tint fill.
//   · --wow-grad-brand → each item's slim vertical accent mark.
//   · --wow-hairline   → the dividers between items.
// BRAND identity stays on the gradient accent mark; neutrals are ink-*.
//
// HONESTY: renders ONLY the real trust items (title/description) — same resolve
// chain as the default (items ?? SITE.trustItems ?? DEFAULT_TRUST_ITEMS). No
// icons are invented and items are NEVER turned into fake numeric stats — they
// stay qualitative. Empty items → returns null, exactly like the default.
const DEFAULT_TRUST_ITEMS = [
  {
    title: 'Friendly local team',
    description: 'Real people who take pride in their work and stand behind it.',
  },
  {
    title: 'Same-day quotes',
    description: 'We reply within a business day, often the same day.',
  },
  {
    title: 'Local team',
    description: 'Familiar faces, familiar streets, real accountability.',
  },
]

export function TrustBarHairlineRowsBlock({
  items,
}: {
  items?: { title: string; description: string }[]
}) {
  const reduce = useReducedMotion()
  const resolved =
    items ??
    (SITE as { trustItems?: { title: string; description: string }[] }).trustItems ??
    DEFAULT_TRUST_ITEMS
  if (resolved.length === 0) return null

  return (
    <section className="relative" style={{ backgroundColor: 'var(--wow-tint)' }}>
      <div className="container-x py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {resolved.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{
                duration: 0.5,
                delay: reduce ? 0 : i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex gap-4 px-0 py-4 md:px-8 md:py-2 [&:not(:first-child)]:border-t md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-t-0"
              style={{ borderColor: 'var(--wow-hairline)' }}
            >
              <span
                aria-hidden
                className="mt-1 h-12 w-1 shrink-0 rounded-full"
                style={{ backgroundImage: 'var(--wow-grad-brand)' }}
              />
              <div>
                <h3 className="text-lg text-brand-900">{item.title}</h3>
                <p className="mt-1.5 text-ink-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
