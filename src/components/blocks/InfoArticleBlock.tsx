import { motion, useReducedMotion } from 'framer-motion'
import type { InfoPageData } from '~/lib/types/page-types'

// INFO-DETAIL VARIANT (Arc 3 · Stage E): the rich long-form MIDDLE content of an info
// page, driven per-item by `info` (ctx.info). It renders — in order — the `intro` lead
// paragraphs, then each `sections` entry ({ heading, body[] paragraphs, list? }), EACH
// section entrance-revealed on scroll. Mirrors Stage C's ServiceDetailsBlock: one block
// consolidating the article body keeps INFO_DETAIL_LAYOUT lean while preserving every
// field InfoPageTemplate rendered.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-brand → the leading hairline accent above each section heading.
//   · --wow-hairline   → the soft rule separating the intro lead from the sections.
//   · --wow-ease-out is expressed inline as the [0.16,1,0.3,1] entrance curve.
// BRAND identity stays on the ramp (brand-* accents) + --wow-*; no fabricated data.
// Reveal on the outer wrapper is applied by the shared SectionList, so there is NO
// opacity-hider here — the per-section whileInView is polish only.
//
// HONESTY (mirrors InfoPageTemplate's per-field guards, per THIS info page):
//   · intro    → the lead block shows only when intro.length > 0
//   · sections → the section list shows only when sections.length > 0; within a
//                section, `list` renders only when it is non-empty
// If intro is empty AND sections is empty the whole block returns null.
export function InfoArticleBlock({
  info,
}: {
  info: InfoPageData
  variant?: string
}) {
  const reduce = useReducedMotion()
  const { intro, sections } = info

  const showIntro = intro.length > 0
  const showSections = sections.length > 0
  if (!showIntro && !showSections) return null

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-x py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          {showIntro && (
            <div className="space-y-5">
              {intro.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-ink-700 md:text-xl">
                  {p}
                </p>
              ))}
            </div>
          )}

          {showSections && (
            <div
              className={showIntro ? 'mt-14 space-y-14 border-t pt-14' : 'space-y-14'}
              style={showIntro ? { borderColor: 'var(--wow-hairline)' } : undefined}
            >
              {sections.map((s, i) => (
                <motion.section
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{
                    duration: 0.55,
                    delay: reduce ? 0 : Math.min(i * 0.06, 0.3),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <span
                    aria-hidden
                    className="block h-1 w-12 rounded-full"
                    style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                  />
                  <h2 className="mt-5 font-display text-2xl leading-tight text-ink-900 sm:text-3xl">
                    {s.heading}
                  </h2>
                  {s.body.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {s.body.map((p, bi) => (
                        <p key={bi} className="leading-relaxed text-ink-700 md:text-lg">
                          {p}
                        </p>
                      ))}
                    </div>
                  )}
                  {s.list && s.list.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {s.list.map((l, li) => (
                        <li
                          key={li}
                          className="flex items-start gap-3 leading-relaxed text-ink-700"
                        >
                          <span
                            aria-hidden
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                          />
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.section>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
