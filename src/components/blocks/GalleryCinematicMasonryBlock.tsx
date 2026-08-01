import { motion, useReducedMotion } from 'framer-motion'
import { PROJECTS } from '~/data/projects'

// Gallery VARIANT: 'cinematic-masonry' — a column-flow wall of rounded, brand-
// hairlined frames that reveal on scroll; each tile zooms on hover under a brand-
// gradient overlay carrying the title/caption. The cinematic, brand-reactive
// counterpart to the flat 'masonry' layout.
//
// WOW tokens consumed (all brand-derived, see styles/app.css):
//   · --wow-grad-brand → the hover caption overlay.
//   · --wow-hairline   → the eyebrow rule + frame borders.
//   · --wow-shadow-glow → the tile hover lift shadow.
//   · --wow-ease-out   → entrance + hover easing.
// BRAND accents → the eyebrow uses the brand-* ramp.
//
// HONESTY: renders ONLY the real PROJECTS images/titles/captions (illustrative
// stock, honestly labeled in the data). Early-returns null when PROJECTS is
// empty, mirroring the default GalleryMasonryBlock.
export function GalleryCinematicMasonryBlock({
  label = 'Our work',
  heading = 'Recent projects',
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const reduce = useReducedMotion()
  if (PROJECTS.length === 0) return null

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

        <div className="mt-12 gap-5 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {PROJECTS.map((p, i) => (
            <motion.figure
              key={`${p.title}-${i}`}
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: reduce ? 0 : (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative mb-5 block break-inside-avoid overflow-hidden rounded-2xl border transition-shadow duration-300"
              style={{ borderColor: 'var(--wow-hairline)' }}
              whileHover={reduce ? undefined : { boxShadow: 'var(--wow-shadow-glow)' }}
            >
              <div className="overflow-hidden">
                <img
                  src={p.image}
                  alt={p.alt ?? p.title}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                />
              </div>
              {/* Brand-gradient caption overlay — appears on hover. */}
              <figcaption
                className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ backgroundImage: 'var(--wow-grad-brand)' }}
              >
                <span className="font-display text-sm font-semibold">{p.title}</span>
                {p.caption && <span className="text-xs italic text-white/80">{p.caption}</span>}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
