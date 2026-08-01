import { motion, useReducedMotion } from 'framer-motion'
import type { ProcessStep } from './process-variants'
import { getProcessIcon } from './process-icons'
import { SITE } from '~/data/site'

// Process VARIANT: 'bold-numerals' — a WOW row of big glass step cards, each
// watermarked with an oversized brand-gradient index numeral. Cards stagger in on
// scroll and lift with a brand glow on hover. The bold, editorial counterpart to
// 'glow-nodes' (the vertical timeline).
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-brand   → the oversized numeral (gradient text) + icon badge + dot.
//   · --wow-shadow-soft  → the resting card shadow.
//   · --wow-shadow-glow  → the hover glow.
//   · --wow-hairline     → the glass card borders.
//   · --wow-ease-out     → entrance easing.
// Neutrals → ink-* / white. No CTA (mirrors the default process section).
//
// HONESTY: renders ONLY real SITE.steps. No steps → null (never fabricates a
// process). The numeral is the step index — not an invented stat.
export function ProcessBoldNumeralsBlock({
  label = 'How it works',
  heading = 'A simple process',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const reduce = useReducedMotion()
  const steps = (SITE as { steps?: ProcessStep[] }).steps
  if (!steps || steps.length === 0) return null
  const items = steps.slice(0, 4)

  return (
    <section className="relative overflow-hidden bg-white">
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

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => {
            const Icon = getProcessIcon(s.icon)
            return (
              <motion.div
                key={`${s.title}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.55, delay: reduce ? 0 : i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={reduce ? undefined : { y: -6 }}
                className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border bg-white p-7 pt-10"
                style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-soft)' }}
              >
                {/* Oversized brand-gradient watermark numeral. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -top-4 select-none bg-clip-text font-display text-[7rem] font-bold leading-none text-transparent opacity-20"
                  style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                >
                  {i + 1}
                </span>
                <span
                  className="relative grid h-12 w-12 place-items-center rounded-xl text-white"
                  style={{ backgroundImage: 'var(--wow-grad-brand)', boxShadow: 'var(--wow-shadow-glow)' }}
                >
                  {Icon ? <Icon className="h-5 w-5" /> : <span className="font-display text-lg font-semibold">{i + 1}</span>}
                </span>
                <h3 className="relative mt-6 font-display text-xl font-semibold tracking-tight text-ink-900">{s.title}</h3>
                <p className="relative mt-2 leading-relaxed text-ink-700">{s.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
