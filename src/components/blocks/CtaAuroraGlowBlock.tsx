import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Phone, Sparkles } from 'lucide-react'
import { SITE } from '~/data/site'

// CTA VARIANT: 'aurora-glow', a full-bleed brand-gradient band with a soft
// ambient glow, an oversized display headline (last word set in the script
// accent), and a glowing white primary pill. The cinematic, high-impact
// counterpart to the boxed 'glass-panel' card.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-brand   → the full-bleed band fill + the soft ambient glow blobs.
//   · --wow-shadow-glow  → the primary CTA's brand glow.
//   · --wow-ease-out     → entrance easing.
// BRAND identity → the band IS the brand gradient; on that dark fill the primary
// action is a white pill (neutral, matches the default band's btn-white) and the
// phone is an outline-white pill. The script accent uses text-brand-100.
//
// HONESTY: renders ONLY the real title/subtitle + the real phone (SITE.phone/
// phoneDisplay) and the optional SITE.tagline badge, nothing invented. No
// urgency stats, no fabricated numbers. Props mirror the default (title/subtitle
// literals) so a no-prop render carries today's real copy.
function splitScriptAccent(heading: string): { lead: string; accent: string } {
  const words = heading.trim().split(/\s+/)
  if (words.length < 2) return { lead: '', accent: heading }
  return { lead: words.slice(0, -1).join(' '), accent: words.slice(-1).join('') }
}

export function CtaAuroraGlowBlock({
  title = tr('cta.readyWhenYouAre'),
  subtitle = tr('cta.quote24'),
}: {
  title?: string
  subtitle?: string
}) {
  const reduce = useReducedMotion()
  const parts = splitScriptAccent(title)
  const label = (SITE as { ctaLabel?: string }).ctaLabel ?? tr('cta.getFreeQuote')

  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ backgroundImage: 'var(--wow-grad-brand)' }}
    >
      {/* Ambient brand glow blobs, decorative, brand-derived, motion honors reduce. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-40"
        style={{ backgroundImage: 'var(--wow-grad-brand)', filter: 'blur(90px)' }}
        animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.35, 0.5, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -right-24 h-96 w-96 rounded-full opacity-30"
        style={{ backgroundColor: 'rgba(255,255,255,0.14)', filter: 'blur(100px)' }}
      />

      <div className="container-x relative py-20 text-center md:py-28">
        {SITE.tagline && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" /> {SITE.tagline}
          </motion.div>
        )}

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-5xl leading-[0.98] tracking-tight text-white sm:text-6xl"
        >
          {parts.lead || title}
          {parts.lead && (
            <span className="mt-1 block font-script text-[1.1em] font-normal leading-[1.05] text-brand-100">
              {parts.accent}
            </span>
          )}
        </motion.h2>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-5 max-w-xl text-lg text-white/85"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap justify-center gap-3.5"
        >
          <PrimaryCta
            className="inline-flex h-[52px] items-center gap-2 rounded-full bg-white px-8 font-semibold text-brand-800 transition-transform hover:-translate-y-0.5"
            style={{ boxShadow: 'var(--wow-shadow-glow)' }}
          >
            {label} <ArrowRight className="h-4 w-4" />
          </PrimaryCta>
          <a
            href={`tel:${SITE.phone}`}
            className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/70 px-6 font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
