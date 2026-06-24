import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Phone } from 'lucide-react'
import { HeroSlideshow } from '~/components/HeroSlideshow'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'
import leaves from '~/assets/decorative/cleaning-leaves.png'

// Markup extracted VERBATIM from routes/index.tsx (the HERO section). Do not
// restyle — block fidelity is pass/fail.
function splitScriptAccent(heading: string): { lead: string; accent: string } {
  const words = heading.trim().split(/\s+/)
  if (words.length < 2) return { lead: '', accent: heading }
  return { lead: words.slice(0, -1).join(' '), accent: words.slice(-1).join('') }
}

export function HeroBlock({
  trustItems = ['Friendly service', 'Same-day quotes', 'Local team', '100% satisfaction'],
  decorativeAsset = leaves,
}: {
  trustItems?: string[]
  decorativeAsset?: string
}) {
  const heroParts = splitScriptAccent(SITE.hero.headline)
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <img src={decorativeAsset} alt="" aria-hidden className="hidden md:block absolute -left-10 top-10 h-[80%] opacity-50 pointer-events-none select-none" />
      <img src={decorativeAsset} alt="" aria-hidden className="hidden md:block absolute -right-10 bottom-0 h-[60%] opacity-40 pointer-events-none select-none rotate-180" />

      <div className="container-x py-14 md:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-700">
              <span className="h-px w-8 bg-brand-600" /> {SITE.hero.kicker}
            </span>
            <h1 className="mt-4">
              {heroParts.lead || SITE.hero.headline}
              {heroParts.lead && (
                <>
                  <br />
                  <span className="font-script text-brand-600 text-[1.15em] block leading-[1.1] mt-1">
                    {heroParts.accent}
                  </span>
                </>
              )}
            </h1>
            {SITE.hero.subheadline && (
              <p className="mt-3 font-display text-xl text-ink-700">
                {SITE.hero.subheadline}
              </p>
            )}
            <p className="mt-6 text-lg text-ink-700 max-w-xl leading-relaxed">
              {SITE.hero.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="btn btn-lg btn-primary">
                {SITE.hero.cta_primary_label} <ArrowRight className="h-4 w-4" />
              </Link>
              {/* NOTE: SITE.hero.cta_secondary_label exists for shape parity
                  with painter + scaffolder cleaning-english emit, but the
                  cleaning template's signature design uses a phone-dial button
                  as the secondary CTA (not a labelled link). Editing
                  hero.cta_secondary_label via AI editor will not produce a
                  visible change. To wire it in, replace this phone button OR
                  add a third button row. */}
              <a href={`tel:${SITE.phone}`} className="btn btn-lg btn-secondary">
                <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
              </a>
            </div>
            <ul className="mt-8 grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-2 text-sm text-ink-700">
              {trustItems.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-brand-600" /> {t}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-6 relative"
          >
            <HeroSlideshow
              images={[{ src: imageSrc(SITE.hero.image_url), alt: HERO_ALT }]}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
