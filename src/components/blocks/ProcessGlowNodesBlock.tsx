import { motion, useReducedMotion } from 'framer-motion'
import { tr } from '~/lib/i18n'
import type { ProcessStep } from './process-variants'
import { getProcessIcon } from './process-icons'
import { SITE } from '~/data/site'

// Process VARIANT: 'glow-nodes' — a WOW vertical timeline. A brand-gradient
// connector line runs down the left; each real step hangs off a glowing numbered
// node (or its icon), the rows staggering in as they scroll into view.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-brand   → the connector line + the numbered node fills + kicker dot.
//   · --wow-grad-surface → the section background.
//   · --wow-shadow-glow  → the node glow (+ card hover glow).
//   · --wow-hairline     → the step card borders.
//   · --wow-ease-out     → entrance easing.
// Neutrals → ink-* / white. No CTA (mirrors the default process section).
//
// HONESTY: renders ONLY real SITE.steps. No steps → null (never fabricates a
// process). Icon falls back to the step number, as the default does.
export function ProcessGlowNodesBlock({
  label = tr('section.howItWorks'),
  heading = tr('section.simpleProcess'),
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const reduce = useReducedMotion()
  const steps = (SITE as { steps?: ProcessStep[] }).steps
  if (!steps || steps.length === 0) return null
  const items = steps.slice(0, 6)

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundImage: 'var(--wow-grad-brand)' }}
            />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-ink-700">{body}</p>}
        </div>

        <div className="relative mt-14 max-w-3xl">
          {/* Brand-gradient connector line running behind the nodes. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-6 left-[27px] top-6 w-0.5 rounded-full opacity-70"
            style={{ backgroundImage: 'var(--wow-grad-brand)' }}
          />
          <ol className="flex flex-col gap-8">
            {items.map((s, i) => {
              const Icon = getProcessIcon(s.icon)
              return (
                <motion.li
                  key={`${s.title}-${i}`}
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.55, delay: reduce ? 0 : i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex items-start gap-6"
                >
                  {/* Glowing numbered node. */}
                  <span
                    className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-display text-xl font-semibold text-white"
                    style={{ backgroundImage: 'var(--wow-grad-brand)', boxShadow: 'var(--wow-shadow-glow)' }}
                  >
                    {Icon ? <Icon className="h-6 w-6" /> : i + 1}
                  </span>
                  {/* Step content in a glass card. */}
                  <motion.div
                    whileHover={reduce ? undefined : { y: -4 }}
                    className="flex-1 rounded-[1.25rem] border bg-white/70 p-6 backdrop-blur-md"
                    style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-soft)' }}
                  >
                    <h3 className="font-display text-xl font-semibold tracking-tight text-ink-900">{s.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink-700">{s.description}</p>
                  </motion.div>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
