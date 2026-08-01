import { motion, useReducedMotion } from 'framer-motion'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Story VARIANT: 'editorial-frame' — a WOW editorial split. The story prose sits
// beside a framed business photo that floats over a radial brand glow; a brand
// hairline rule underlines the eyebrow, and the copy + frame reveal on scroll.
// The premium, brand-reactive counterpart to the plain 'split-image' layout.
//
// WOW tokens consumed (all brand-derived, see styles/app.css):
//   · --wow-grad-brand → the radial glow behind the framed photo.
//   · --wow-shadow-lift → the frame's deep lift shadow.
//   · --wow-hairline    → the eyebrow rule + frame border.
//   · --wow-ease-out    → entrance easing.
// BRAND accents → the script accent + eyebrow use the brand-* ramp.
//
// HONESTY: renders only SITE.about (or the `body` prop) + SITE.name — no invented
// figures. Uses the existing SITE.hero.image_url (optional SITE.story.image
// override), never a fabricated photo. Early-returns null when there is no prose,
// mirroring the default StoryNarrativeBlock's omit-when-empty behavior.
export function StoryEditorialFrameBlock({
  label = 'Our story',
  heading,
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const reduce = useReducedMotion()
  const storyImage = (SITE as { story?: { image?: string } }).story?.image
  const prose = body ?? SITE.about
  if (!prose) return null

  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy column */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundImage: 'var(--wow-grad-brand)' }}
              />
              {label}
            </span>

            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
              {heading ?? (
                <>
                  About{' '}
                  <span className="font-script font-normal text-brand-600">{SITE.name}</span>
                </>
              )}
            </h2>

            {/* Brand hairline rule. */}
            <motion.div
              initial={reduce ? undefined : { scaleX: 0 }}
              whileInView={reduce ? undefined : { scaleX: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 h-px w-24 origin-left"
              style={{ backgroundImage: 'var(--wow-grad-brand)' }}
            />

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-700">{prose}</p>
          </motion.div>

          {/* Framed photo over a radial brand glow. */}
          <motion.div
            initial={reduce ? undefined : { opacity: 0, scale: 0.95 }}
            whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-60"
              style={{ backgroundImage: 'var(--wow-grad-brand)', filter: 'blur(56px)' }}
            />
            <div
              className="overflow-hidden rounded-[1.75rem] border bg-white"
              style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-lift)' }}
            >
              <img
                src={imageSrc(storyImage ?? SITE.hero.image_url)}
                alt={HERO_ALT}
                loading="lazy"
                width={900}
                height={700}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
