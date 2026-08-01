import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { FAQ } from '~/lib/types/page-types'

// FAQ VARIANT: 'glass-accordion' — a refined, tactile accordion. Each question is
// its own lifted GLASS card with a brand hairline; a gradient "+" badge rotates to
// an "×" on open and the active card gains a soft brand glow. Cards stagger in as
// they scroll into view. Answers expand/collapse with a smooth height motion.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand-tint background.
//   · --wow-grad-brand   → the "+"/"×" toggle badge fill.
//   · --wow-shadow-glow  → the open card's brand glow.
//   · --wow-hairline     → the card hairline borders.
//   · --wow-ease-out     → entrance + expand easing.
//
// A11y: real <button> toggles with aria-expanded; SSR-safe client open state (first
// item defaults open). HONESTY: renders ONLY the real `faqs` passed in; returns null
// when empty (mirrors the default FAQSection). `title` is the contract override.
export function FaqGlassAccordionBlock({
  faqs,
  title = 'Frequently asked questions',
}: {
  faqs: FAQ[]
  title?: string
}) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(0)
  if (faqs.length === 0) return null

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="divider-diamond mb-4 text-center"><span>◆</span></div>
          <h2 className="text-center">{title}</h2>

          <motion.div
            className="mt-10 space-y-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10%' }}
            variants={{
              hidden: {},
              show: {
                transition: reduce ? {} : { staggerChildren: 0.06, delayChildren: 0.04 },
              },
            }}
          >
            {faqs.map((faq, i) => {
              const isOpen = open === i
              return (
                <motion.div
                  key={i}
                  className="overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-md transition-shadow"
                  style={{
                    borderColor: 'var(--wow-hairline)',
                    boxShadow: isOpen ? 'var(--wow-shadow-glow)' : 'none',
                  }}
                  variants={{
                    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 16 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-ink-900 md:text-lg">
                      {faq.question}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                      style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? 'auto' : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 leading-relaxed text-ink-700">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
