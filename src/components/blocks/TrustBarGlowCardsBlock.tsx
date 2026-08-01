import { Clock, Heart, ShieldCheck } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { SITE } from '~/data/site'

// TRUST BAR VARIANT: 'glow-cards' — the real trust items as frosted glass cards,
// each with a brand-gradient icon badge, that lift and glow on hover and
// stagger in as they enter the viewport. The rich, tactile counterpart to the
// flat 'hairline-rows' variant.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand tint background.
//   · --wow-grad-brand   → each card's icon badge fill.
//   · --wow-shadow-glow  → the card's brand glow on hover.
//   · --wow-hairline     → the card hairline border.
// BRAND identity stays on the gradient badge; neutrals are ink-*/white.
//
// HONESTY: renders ONLY the real trust items (title/description) — same resolve
// chain as the default (items ?? SITE.trustItems ?? DEFAULT_TRUST_ITEMS) and the
// same fixed icon set zipped by index. Items are qualitative, NOT turned into
// fake numeric stats. Empty items → returns null, exactly like the default.
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

export function TrustBarGlowCardsBlock({
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

  const icons: ReactNode[] = [
    <ShieldCheck className="h-6 w-6" strokeWidth={1.8} />,
    <Clock className="h-6 w-6" strokeWidth={1.8} />,
    <Heart className="h-6 w-6" strokeWidth={1.8} />,
  ]

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-14 md:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {resolved.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{
                duration: 0.55,
                delay: reduce ? 0 : i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={reduce ? undefined : { y: -6 }}
              className="group rounded-2xl border bg-white/80 p-7 backdrop-blur-md transition-shadow"
              style={{ borderColor: 'var(--wow-hairline)' }}
            >
              <span
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-shadow"
                style={{ backgroundImage: 'var(--wow-grad-brand)', boxShadow: 'var(--wow-shadow-glow)' }}
              >
                {icons[i % icons.length]}
              </span>
              <h3 className="mt-5 text-brand-900">{item.title}</h3>
              <p className="mt-2 text-ink-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
