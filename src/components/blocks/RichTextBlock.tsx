import { motion } from 'framer-motion'

// Generic PROSE block (Phase 2, custom pages). The one content-bearing primitive whose
// copy rides entirely in block.params (not a global data store), so a customer-created
// page ("Financing", "Our Process", "Careers") can carry arbitrary supplied text and
// always render with real content. Every other block either self-sources from global
// site data or takes copy via params the same way, richText just makes multi-paragraph
// body copy a first-class, per-section channel.
//
// HONESTY: renders ONLY the copy passed in; returns null when there is no heading AND no
// body (no fabricated prose). Paragraphs split on blank lines; single newlines break.
// WOW tokens: brand eyebrow + soft brand-tint surface, consistent with IntroBlock.
export function RichTextBlock({
  eyebrow,
  heading,
  body,
}: {
  eyebrow?: string
  heading?: string
  body?: string
}) {
  const paragraphs = (body ?? '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
  if (!heading && paragraphs.length === 0) return null
  return (
    <section className="relative">
      <div className="container-x py-16 md:py-24">
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
          {heading && (
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl">
              {heading}
            </h2>
          )}
          {paragraphs.length > 0 && (
            <div className="mt-6 space-y-5">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-ink-700 whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
