import { motion, useReducedMotion } from 'framer-motion'
import { tr } from '~/lib/i18n'
import { PROJECTS } from '~/data/projects'

// Gallery VARIANT: 'edge-grid', an edge-to-edge uniform grid of photos with a
// brand-gradient corner accent on each tile and a staggered scroll reveal; the
// title/caption ride a brand-gradient band that slides up on hover. The bold,
// architectural, brand-reactive counterpart to the flat 'grid' layout.
//
// WOW tokens consumed (all brand-derived, see styles/app.css):
//   · --wow-grad-brand → the per-tile corner accent + hover caption band.
//   · --wow-hairline   → the eyebrow rule + tile borders.
//   · --wow-shadow-glow → the tile hover lift shadow.
//   · --wow-ease-out   → entrance + hover easing.
// BRAND accents → the eyebrow uses the brand-* ramp.
//
// HONESTY: renders ONLY the real PROJECTS images/titles/captions. Early-returns
// null when PROJECTS is empty, mirroring the default GalleryMasonryBlock.
export function GalleryEdgeGridBlock({
  label = tr('section.ourWork'),
  heading = tr('section.recentProjects'),
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
      <div className="container-x pt-20 md:pt-28">
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
      </div>

      {/* Edge-to-edge grid, no container padding, tiles butt the viewport edges. */}
      <div className="mt-12 grid grid-cols-2 gap-px bg-[var(--wow-hairline)] lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <motion.figure
            key={`${p.title}-${i}`}
            initial={reduce ? undefined : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: reduce ? 0 : (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden bg-white transition-shadow duration-300"
            whileHover={reduce ? undefined : { boxShadow: 'var(--wow-shadow-glow)' }}
          >
            <img
              src={p.image}
              alt={p.alt ?? p.title}
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
            />
            {/* Brand-gradient corner accent. */}
            <span
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 h-14 w-14 opacity-80"
              style={{
                backgroundImage: 'var(--wow-grad-brand)',
                clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
              }}
            />
            {/* Caption band slides up on hover. */}
            <figcaption
              className="absolute inset-x-0 bottom-0 translate-y-full p-4 text-white transition-transform duration-300 ease-out group-hover:translate-y-0"
              style={{ backgroundImage: 'var(--wow-grad-brand)' }}
            >
              <span className="block font-display text-sm font-semibold">{p.title}</span>
              {p.caption && <span className="text-xs italic text-white/80">{p.caption}</span>}
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
