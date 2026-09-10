import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { PROJECTS } from '~/data/projects'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'
import { hasPhone } from '~/lib/phone'

// Hero LAYOUT: 'gallery' (niche arc Stage 4) — the gallery-led hero the Beauty Portfolio and Project
// Showcase templates lead with: the work itself, as a mosaic of the owner's photos beside the headline.
//
// THE PHOTOS ARE THE GALLERY FILE (PROJECTS, src/data/projects.ts): emitted every build from
// customer_assets (the owner's uploads, owner tier) — so the hero shows the owner's own work, in the order
// the gallery holds, and the editor's gallery ops (add / remove / reorder, test-gallery-file) are the
// hero's editing surface too. Nothing new to persist, no new array key: a rebuild re-reads the uploads.
// No photos → the single hero image (the same split the modern hero renders), never a stock mosaic.
//
// TOKEN DISCIPLINE: CTA -> bg-cta / text-cta-foreground. Accent -> fam-accent-* (DNA). Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Same motion as the split heroes. Props identical to HeroBlock.
// One big photo and two stacked beside it — what a 6×2 grid holds without spilling into a third row.
const MOSAIC_MAX = 3

export function HeroGalleryBlock({
  site = SITE,
  trustItems = [tr('trust.freeEstimates'), tr('trust.onSchedule'), tr('trust.localTeam'), tr('trust.satisfactionGuaranteed')],
  projects = PROJECTS,
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
  projects?: typeof PROJECTS
}) {
  const photos = projects.filter((p) => p.image).slice(0, MOSAIC_MAX)
  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
              <span className="h-px w-6 bg-fam-accent" />
              {site.hero.kicker}
            </span>

            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-fam-ink sm:text-6xl">
              {site.hero.headline}
            </h1>

            {site.hero.subheadline && (
              <p className="mt-5 text-xl leading-relaxed text-fam-ink-muted">{site.hero.subheadline}</p>
            )}

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fam-ink-muted">{site.hero.body}</p>

            <div className="mt-9 flex flex-wrap gap-4">
              <PrimaryCta className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-cta px-7 font-display text-base font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)">
                {site.hero.cta_primary_label} <ArrowRight className="h-4 w-4" />
              </PrimaryCta>
              {hasPhone(site.phone) && (
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-fam-hairline px-6 font-display font-semibold text-fam-ink transition-colors hover:border-fam-accent hover:text-fam-accent-text-strong"
                >
                  <Phone className="h-4 w-4 text-fam-accent-text" /> {site.phoneDisplay}
                </a>
              )}
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fam-ink-muted">
              {trustItems.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-fam-accent-text" /> {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
            {photos.length >= 2 ? (
              <ul className="grid grid-cols-6 grid-rows-2 gap-3" aria-label={tr('hero.galleryLabel')}>
                {photos.map((p, i) => (
                  <li
                    key={p.image + i}
                    className={
                      i === 0
                        ? 'col-span-4 row-span-2 aspect-[4/3] overflow-hidden rounded-2xl border border-fam-hairline'
                        : photos.length === 2
                          ? 'col-span-2 row-span-2 overflow-hidden rounded-2xl border border-fam-hairline'
                          : 'col-span-2 row-span-1 overflow-hidden rounded-2xl border border-fam-hairline'
                    }
                  >
                    <img
                      src={imageSrc(p.image)}
                      alt={p.alt ?? p.title}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      className="h-full w-full object-cover"
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-fam-hairline shadow-(--elev-1)">
                <img src={imageSrc(photos[0]?.image ?? site.hero.image_url)} alt={photos[0]?.alt ?? photos[0]?.title ?? HERO_ALT} className="aspect-[4/3] w-full object-cover" />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
