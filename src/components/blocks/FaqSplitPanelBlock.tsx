import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import type { FAQ } from '~/lib/types/page-types'

// FAQ VARIANT: 'split-panel' — an editorial two-column layout. A sticky
// brand-gradient side panel carries the heading (and a soft glow) beside the Q&A
// list, which sits on a soft brand-tinted surface. Rows reveal in a stagger as
// they scroll into view; each toggles open with a chevron rotate.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand-tint background.
//   · --wow-grad-brand   → the side panel fill.
//   · --wow-shadow-lift  → the side panel's lift shadow.
//   · --wow-hairline     → the Q&A row dividers.
//   · --wow-ease-out     → entrance + expand easing.
//
// A11y: real <button> toggles with aria-expanded; SSR-safe client open state (first
// item defaults open). HONESTY: renders ONLY the real `faqs` passed in; returns null
// when empty (mirrors the default FAQSection). `title` is the contract override.
export function FaqSplitPanelBlock({
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
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Brand-gradient side panel. */}
          <div className="lg:col-span-4">
            <div
              className="relative overflow-hidden rounded-[1.5rem] p-8 text-white lg:sticky lg:top-24"
              style={{
                backgroundImage: 'var(--wow-grad-brand)',
                boxShadow: 'var(--wow-shadow-lift)',
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/15 blur-3xl"
              />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
                <HelpCircle className="h-5 w-5" />
              </span>
              <h2 className="relative mt-5 text-white">{title}</h2>
              <p className="relative mt-3 text-sm text-white/80">
                Everything you need to know before we get started.
              </p>
            </div>
          </div>

          {/* Q&A list. */}
          <motion.div
            className="lg:col-span-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-10%' }}
            variants={{
              hidden: {},
              show: {
                transition: reduce ? {} : { staggerChildren: 0.05, delayChildren: 0.04 },
              },
            }}
          >
            <div className="border-t" style={{ borderColor: 'var(--wow-hairline)' }}>
              {faqs.map((faq, i) => {
                const isOpen = open === i
                return (
                  <motion.div
                    key={i}
                    className="border-b"
                    style={{ borderColor: 'var(--wow-hairline)' }}
                    variants={{
                      hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 14 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="focus-ring flex w-full items-start justify-between gap-4 rounded-md py-5 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base font-semibold text-ink-900 md:text-lg">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`mt-1 h-5 w-5 shrink-0 text-brand-600 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
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
                      <div className="pb-5 pr-8 leading-relaxed text-ink-700">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
