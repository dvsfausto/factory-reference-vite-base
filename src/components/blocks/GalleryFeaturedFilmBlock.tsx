import { motion, useReducedMotion } from 'framer-motion'
import { tr } from '~/lib/i18n'
import { PROJECTS } from '~/data/projects'

// Gallery VARIANT: 'featured-film', a large lead image over a radial brand glow
// with a floating glass caption chip, followed by a horizontal filmstrip of the
// remaining photos (each with its own glass chip). A cinematic hero-and-strip
// composition, brand-reactive throughout.
//
// WOW tokens consumed (all brand-derived, see styles/app.css):
//   · --wow-grad-brand → the glow behind the featured image + chip dot.
//   · --wow-shadow-lift → the featured frame's deep lift shadow.
//   · --wow-hairline   → the eyebrow rule + frame/chip borders.
//   · --wow-ease-out   → entrance easing.
// BRAND accents → the eyebrow uses the brand-* ramp.
//
// HONESTY: renders ONLY the real PROJECTS images/titles/captions. Early-returns
// null when PROJECTS is empty (and guards the featured item), mirroring the
// default GalleryMasonryBlock's omit-when-empty behavior.
export function GalleryFeaturedFilmBlock({
  label = tr('section.ourWork'),
  heading = tr('section.recentProjects'),
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const reduce = useReducedMotion()
  const [featured, ...rest] = PROJECTS
  if (!featured) return null

  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
            <span className="h-px w-8" style={{ backgroundImage: 'var(--wow-grad-brand)' }} />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
            {heading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-ink-700">{body}</p>}
        </div>

        {/* Featured lead image over a radial brand glow. */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 28 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-50"
            style={{ backgroundImage: 'var(--wow-grad-brand)', filter: 'blur(56px)' }}
          />
          <div
            className="relative overflow-hidden rounded-[1.75rem] border bg-white"
            style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-lift)' }}
          >
            <img
              src={featured.image}
              alt={featured.alt ?? featured.title}
              className="h-[44vh] min-h-[320px] w-full object-cover md:h-[56vh]"
            />
            <div
              className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-2xl border bg-white/85 px-4 py-2.5 backdrop-blur-md"
              style={{ borderColor: 'var(--wow-hairline)' }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundImage: 'var(--wow-grad-brand)' }}
              />
              <span className="font-display text-sm font-semibold text-ink-900">
                {featured.title}
              </span>
              {featured.caption && (
                <span className="text-xs italic text-ink-500">{featured.caption}</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Filmstrip of the remaining photos. */}
        {rest.length > 0 && (
          <div className="mt-6 flex gap-5 overflow-x-auto pb-3">
            {rest.map((p, i) => (
              <motion.figure
                key={`${p.title}-${i}`}
                initial={reduce ? undefined : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-64 flex-none overflow-hidden rounded-2xl border sm:w-72"
                style={{ borderColor: 'var(--wow-hairline)' }}
              >
                <img
                  src={p.image}
                  alt={p.alt ?? p.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <figcaption
                  className="absolute bottom-3 left-3 rounded-full border bg-white/85 px-3 py-1.5 backdrop-blur-md"
                  style={{ borderColor: 'var(--wow-hairline)' }}
                >
                  <span className="font-display text-xs font-semibold text-ink-900">{p.title}</span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
