import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

// CTA VARIANT: 'glass-panel', a boxed, frosted-glass CTA card that floats over
// a soft radial brand-tinted section. A brand hairline frames the card, a deep
// lift shadow raises it off the surface, and a gradient accent rule tops the copy.
// The contained, boutique counterpart to the full-bleed 'aurora-glow' band.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section's soft radial brand tint background.
//   · --wow-grad-brand   → the accent rule above the headline + the primary glow blob.
//   · --wow-shadow-lift  → the floating glass card's deep lift shadow.
//   · --wow-shadow-glow  → the primary CTA's brand glow.
//   · --wow-hairline     → the card's hairline border.
// BRAND identity → the primary CTA uses bg-primary/text-primary-foreground
// (var(--primary)); the script accent uses text-brand-600 (brand ramp).
//
// HONESTY: renders ONLY the real title/subtitle + the real phone (SITE.phone/
// phoneDisplay), nothing invented, no urgency stats. Props mirror the default
// (title/subtitle literals) so a no-prop render carries today's real copy.
function splitScriptAccent(heading: string): { lead: string; accent: string } {
  const words = heading.trim().split(/\s+/)
  if (words.length < 2) return { lead: '', accent: heading }
  return { lead: words.slice(0, -1).join(' '), accent: words.slice(-1).join('') }
}

export function CtaGlassPanelBlock({
  title = tr('cta.readyWhenYouAre'),
  subtitle = tr('cta.quote24'),
}: {
  title?: string
  subtitle?: string
}) {
  const parts = splitScriptAccent(title)
  const label = (SITE as { ctaLabel?: string }).ctaLabel ?? 'Get Free Quote'

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x relative py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-3xl"
        >
          {/* Brand glow behind the floating card. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] opacity-60"
            style={{ backgroundImage: 'var(--wow-grad-brand)', filter: 'blur(52px)' }}
          />
          <div
            className="overflow-hidden rounded-[1.75rem] border bg-white/80 px-8 py-12 text-center backdrop-blur-md md:px-14 md:py-16"
            style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-lift)' }}
          >
            <span
              aria-hidden
              className="mx-auto mb-7 block h-1.5 w-16 rounded-full"
              style={{ backgroundImage: 'var(--wow-grad-brand)' }}
            />

            <h2 className="mx-auto max-w-2xl text-4xl leading-[1.02] tracking-tight text-brand-900 sm:text-5xl">
              {parts.lead || title}
              {parts.lead && (
                <span className="mt-1 block font-script text-[1.12em] font-normal leading-[1.05] text-brand-600">
                  {parts.accent}
                </span>
              )}
            </h2>

            {subtitle && (
              <p className="mx-auto mt-4 max-w-lg text-lg text-ink-700">{subtitle}</p>
            )}

            <div className="mt-9 flex flex-wrap justify-center gap-3.5">
              <PrimaryCta
                className="inline-flex h-[52px] items-center gap-2 rounded-full bg-primary px-8 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                style={{ boxShadow: 'var(--wow-shadow-glow)' }}
              >
                {label} <ArrowRight className="h-4 w-4" />
              </PrimaryCta>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex h-[52px] items-center gap-2 rounded-full border px-6 font-semibold text-brand-800 transition-colors hover:bg-brand-50"
                style={{ borderColor: 'var(--wow-hairline)' }}
              >
                <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
