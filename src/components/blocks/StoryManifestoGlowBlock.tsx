import { motion, useReducedMotion } from 'framer-motion'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'

// Story VARIANT: 'manifesto-glow', a large, centered narrative statement on a
// soft radial brand-tinted surface, opened by an oversized brand-gradient quote
// mark and closed with a script-accented attribution. The cinematic, brand-
// reactive counterpart to the flat white 'narrative' layout.
//
// WOW tokens consumed (all brand-derived, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand-tint background.
//   · --wow-grad-brand   → the oversized quote mark + the accent hairlines.
//   · --wow-ease-out     → entrance easing.
// BRAND accents → the quote mark uses --wow-grad-brand (bg-clip-text); the
// attribution + eyebrow use the brand-* ramp.
//
// HONESTY: renders only the real story copy, SITE.story.quote (optional cast
// override) falling back to SITE.about, and SITE.story.attribution ?? SITE.name.
// No invented figures. Early-returns null when there is no quote, mirroring the
// default StoryNarrativeBlock's omit-when-empty behavior.
export function StoryManifestoGlowBlock({
  site = SITE,
  label = tr('section.ourStory'),
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const reduce = useReducedMotion()
  const story = (site as { story?: { quote?: string; attribution?: string } }).story
  const quote = body ?? story?.quote ?? site.about
  const attribution = story?.attribution ?? site.name
  if (!quote) return null

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-24 md:py-36">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-700">
            <span className="h-px w-10" style={{ backgroundImage: 'var(--wow-grad-brand)' }} />
            {label}
            <span className="h-px w-10" style={{ backgroundImage: 'var(--wow-grad-brand)' }} />
          </span>

          {/* Oversized brand-gradient quote mark. */}
          <span
            aria-hidden
            className="mt-4 block bg-clip-text font-display text-[7rem] leading-[0.6] text-transparent sm:text-[9rem]"
            style={{ backgroundImage: 'var(--wow-grad-brand)' }}
          >
            &ldquo;
          </span>

          <p className="mt-2 font-display text-3xl font-medium leading-snug tracking-tight text-ink-900 sm:text-4xl">
            {quote}
          </p>

          <p className="mt-8 font-script text-2xl font-normal text-brand-600">{attribution}</p>
        </motion.div>
      </div>
    </section>
  )
}
