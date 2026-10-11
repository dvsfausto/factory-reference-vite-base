import { motion } from 'framer-motion'
import { parseRichText } from '~/lib/rich-text'
import { Runs } from '~/components/blocks/RichTextBlock'

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
  /* ★ designed copy (ZB-241, 2026-10-11): the About page's prose is the assistant's small Markdown too (an owner's About showed
     "**Inside Experience**", "- Career clarity" and "[Book a call](https://…)" as typed): headings, lists, emphasis and links in the
     site's own type, paragraphs on blank lines. Plain copy is one paragraph, as before. */
  const blocks = parseRichText(body ?? '')
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x relative py-section">
        <motion.div
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
          {body && blocks.length > 0 && (
            <div className="mt-6 space-y-5">
              {blocks.map((b, i) =>
                b.kind === 'heading' ? (
                  b.level === 2
                    ? <h2 key={i} className="pt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-ink-900"><Runs runs={b.runs} /></h2>
                    : <h3 key={i} className="pt-1 font-display text-lg font-semibold text-ink-900"><Runs runs={b.runs} /></h3>
                ) : b.kind === 'list' ? (
                  <ul key={i} className="space-y-3">
                    {b.items.map((item, j) => (
                      <li key={j} className="flex gap-3 text-lg leading-relaxed text-ink-700">
                        <span aria-hidden="true" className="mt-[0.7em] h-2 w-2 shrink-0 rounded-full" style={{ backgroundImage: 'var(--wow-grad-brand)' }} />
                        <span><Runs runs={item} /></span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="text-lg leading-relaxed text-ink-700 whitespace-pre-line"><Runs runs={b.runs} /></p>
                ),
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
