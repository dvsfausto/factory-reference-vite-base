import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// Hero LAYOUT: 'video' — a background video behind centered text, with a scrim for
// legibility. The video source is DATA, not hardcoded: it is read from an OPTIONAL
// SITE.hero.video_url consumed via the same inline-cast precedent the codebase
// uses for SITE.surface (HeroElegantBlock). site.ts is never edited; the field is
// emit-when-present (mirrors surface in the scaffolder), so every existing fixture
// — none of which set it — renders the GRACEFUL fallback below, byte-identical.
//
// FALLBACK: when no video_url is present, no <video> is mounted at all — the
// existing hero.image_url is used as a still poster, so the layout degrades to a
// clean centered photo hero instead of a black or broken frame. When a video IS
// set, image_url is its poster (shown before the video paints / if it can't play).
//
// LEGIBILITY: a real top-and-bottom darkening gradient scrim (not a flat box)
// keeps centered text readable over moving footage of any brightness.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700: emerald-100 on
// dark, emerald-600 rule + dots. Radius -> rounded-* (DNA). Font -> font-display
// (DNA). Cool surface (slate-950) component-owned. Never bg-brand-* / .btn.
//
// Props identical to HeroBlock; decorativeAsset accepted for parity but unused.
// Returns an Element (no null), matching HeroBlock.
export function HeroVideoBlock({
  trustItems = ['Free estimates', 'On schedule', 'Local team', 'Satisfaction guaranteed'],
}: {
  trustItems?: string[]
  decorativeAsset?: string
}) {
  const videoUrl = (SITE.hero as { video_url?: string }).video_url
  const poster = imageSrc(SITE.hero.image_url)

  return (
    <section className="relative isolate flex min-h-[34rem] flex-col overflow-hidden bg-slate-950 text-white md:min-h-[40rem]">
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        >
          <source src={videoUrl} />
        </video>
      ) : (
        <img
          src={poster}
          alt={HERO_ALT}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/85 via-slate-950/50 to-slate-950/85" />

      <div className="container-x relative flex flex-1 items-center justify-center py-24 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
            <span className="h-px w-7 bg-emerald-600" />
            {SITE.hero.kicker}
            <span className="h-px w-7 bg-emerald-600" />
          </span>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.03] tracking-tight text-white drop-shadow-sm sm:text-6xl lg:text-7xl">
            {SITE.hero.headline}
          </h1>

          {SITE.hero.subheadline && (
            <p className="mt-5 text-xl leading-relaxed text-slate-200">
              {SITE.hero.subheadline}
            </p>
          )}

          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
            {SITE.hero.body}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-primary px-7 font-display text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {SITE.hero.cta_primary_label} <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 font-display font-semibold text-white backdrop-blur-sm transition-colors hover:border-emerald-600 hover:text-emerald-100"
            >
              <Phone className="h-4 w-4 text-emerald-100" /> {SITE.phoneDisplay}
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-200">
            {trustItems.map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
