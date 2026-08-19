import { motion } from 'framer-motion'

// Shared WOW page-intro (Arc 3 · Stage B), the brand-reactive replacement for the
// page-local AboutIntro/PricingIntro AND the header for the converted inner pages
// (reviews, contact, services index, areas index). Rendered via the shared
// renderSection 'intro' case (see render-section.tsx), which reads it off the
// SectionContext, so a page sets its intro copy as data (ctx) instead of JSX.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand-tint background.
//   · --wow-grad-brand   → the eyebrow chip's gradient dot.
// BRAND identity → the eyebrow label + optional script accent use the brand ramp
// (text-brand-*); the heading/body use the ink ramp. No literal non-brand hex.
//
// HONESTY: renders ONLY the content passed in; returns null when `heading` is
// empty (no fabricated copy). Reveal is applied by the SectionList wrapper, so this
// component does NOT hide itself on scroll, the framer-motion whileInView below is
// intra-section entrance polish only (SSR-safe, honours prefers-reduced-motion via
// framer-motion + app.css).
export function IntroBlock({
  eyebrow,
  heading,
  body,
  script,
}: {
  eyebrow?: string
  heading: string
  body?: string
  script?: string
}) {
  if (!heading) return null
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x relative py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundImage: 'var(--wow-grad-brand)' }}
              />
              {eyebrow}
            </span>
          )}
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
            {heading}
            {script && (
              <span className="mt-1 block font-script text-[1.15em] font-normal leading-[1.05] text-brand-600">
                {script}
              </span>
            )}
          </h1>
          {body && (
            <p className="mt-6 text-lg leading-relaxed text-ink-700">{body}</p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
