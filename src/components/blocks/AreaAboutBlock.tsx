import type { ServiceAreaPageData } from '~/lib/types/page-types'

// AREA-DETAIL VARIANT (Arc 3 · Stage D): renders THIS area's `about` section — the
// "at a glance" lead copy — as a WOW composition: an eyebrow + headline over a soft
// glass panel of paragraphs. Per-item content flows in via the `area` prop
// (ctx.area from the route), so the SAME block serves every area page with its OWN
// copy. This is the block analogue of ServiceAreaPageTemplate's "AT A GLANCE / ABOUT"
// section (which it replaces on the detail route). It is the Stage-D mirror of
// ServiceWhatWeCoverBlock.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand tint background.
//   · --wow-grad-brand   → the eyebrow accent text.
//   · --wow-hairline     → panel hairline border.
//   · --wow-shadow-soft  → panel resting lift.
// BRAND identity stays on --wow-* / the brand ramp; no literal brand hex.
//
// HONESTY: renders ONLY the real per-area about copy. Returns null when there are no
// body paragraphs (nothing to say → nothing shown), matching the honest empty-omit
// behaviour of ServiceAreaPageTemplate (which guards on `about.body.length > 0`).
// Reveal is applied by the shared SectionList, so this block adds no opacity-hider.
export function AreaAboutBlock({
  area,
}: {
  area: ServiceAreaPageData
  variant?: string
}) {
  const { about, name } = area
  if (about.body.length === 0) return null

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-16 md:py-24">
        <div
          className="mx-auto max-w-3xl rounded-3xl border bg-white/85 p-8 backdrop-blur-md md:p-10"
          style={{
            borderColor: 'var(--wow-hairline)',
            boxShadow: 'var(--wow-shadow-soft)',
          }}
        >
          <span
            className="text-xs font-bold uppercase tracking-[0.18em]"
            style={{
              color: 'transparent',
              backgroundImage: 'var(--wow-grad-brand)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            {name} at a glance
          </span>
          <h2 className="mt-3 font-display text-3xl leading-tight text-ink-900 sm:text-4xl">
            {about.title}
          </h2>
          <div className="mt-5 space-y-4">
            {about.body.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-ink-700">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
