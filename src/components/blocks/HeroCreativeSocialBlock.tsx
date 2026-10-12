import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'
import { heroFocusStyle } from '~/lib/hero-focus'

import { hasPhone } from '~/lib/phone'
import { hasText } from '~/lib/has-text'
import { socialProfiles } from '~/lib/social-profiles'
import { SocialIcon } from './SocialIcon'
// Hero VARIANT: 'creative-social' (2026-10-12), the 'creative' hero for a creator: the same layout, but
//   · no sticker on the photo (only the owner's own words);
//   · under the buttons, the platforms she links to (SITE.social) with their follower counts (SITE.stats), each a link to her
//     profile in a new tab; the counts show only with their date (the `note`, e.g. "Follower counts as of September 30, 2026");
//   · no platform linked → no row (never the generic trust phrases).
// A catalogue variant: a site gets it only if its layout chooses it; 'creative' is unchanged.
//
// (from 'creative':) expressive, color-forward, asymmetric-within-section.
// An off-balance split (uneven columns), an oversized display headline, and an
// image overlapped by a vivid magenta blob + a big rounded color field behind it.
// The strongest creative the fixed-section skeleton allows, bold WITHIN the
// section (page-level layout-breaking is a separate, future unlock).
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (BRAND-
// owned). Accent → emerald-* (DNA → magenta): the color blobs, eyebrow, marks.
// Radius → rounded-* (DNA, large/expressive). Font → font-display (DNA Syne).
// Expressive light surface component-owned (off-white / ink #18181B / #71717A).
// Never bg-brand-*/.btn-primary/.btn.
//
// Props identical to HeroBlock; decorativeAsset accepted for parity but unused.
// Returns an Element (no null).
export function HeroCreativeSocialBlock({
  site = SITE,
  trustItems = [tr('trust.freeEstimates'), tr('trust.onSchedule'), tr('trust.localTeam'), tr('trust.satisfactionGuaranteed')],
  headline = site.hero.headline,
  body = site.hero.body,
  imageUrl = site.hero.image_url,
  kicker = site.hero.kicker,
  subheadline = site.hero.subheadline,
  ctaLabel = site.hero.cta_primary_label,
  note,
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
  headline?: string
  body?: string
  imageUrl?: string
  kicker?: string
  subheadline?: string
  ctaLabel?: string
  /** the date the counts were true; without it the counts are not shown */
  note?: string
}) {
  const profiles = socialProfiles(site)
  const dated = hasText(note)
  return (
    <section className="relative isolate overflow-hidden bg-fam-surface-2">
      {/* Big rounded magenta field, off-canvas right, color-forward backdrop. */}
      <div className="absolute -right-32 -top-24 -z-10 hidden h-[34rem] w-[34rem] rounded-3xl bg-fam-accent-soft lg:block" />

      <div className="container-x py-section">
        {/* top-aligned (not centred): the photo's top sits level with the headline's, however long the words column runs */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div
            data-enter="up"
            className="lg:col-span-7"
          >
            {hasText(kicker) && (
              <span className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.14em] text-fam-ink">
                <span className="inline-block h-4 w-4 rounded bg-fam-accent" />
                {kicker}
              </span>
            )}

            <h1 className="mt-5 font-display text-6xl font-extrabold leading-[0.95] tracking-tight text-fam-ink sm:text-7xl lg:text-8xl">
              {headline}
            </h1>

            {hasText(subheadline) && (
              <p className="mt-6 max-w-lg text-2xl font-medium leading-snug text-fam-accent-text-strong">
                {subheadline}
              </p>
            )}

            {hasText(body) && (
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-fam-ink-muted">
                {body}
              </p>
            )}

            <div className="mt-9 flex flex-wrap gap-4">
              <PrimaryCta
                className="inline-flex h-[56px] items-center gap-2 rounded-2xl bg-cta px-8 font-display text-base font-bold text-cta-foreground transition-transform hover:translate-y-(--hov-lift-sm)"
              >
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </PrimaryCta>
              {hasPhone(site.phone) && (<a
                href={`tel:${site.phone}`}
                className="inline-flex h-[56px] items-center gap-2 rounded-2xl border-2 border-fam-ink px-7 font-display font-bold text-fam-ink transition-colors hover:bg-fam-accent hover:border-fam-accent hover:text-fam-on-accent"
              >
                <Phone className="h-4 w-4" /> {site.phoneDisplay}
              </a>)}
            </div>

            {profiles.length > 0 && (
              <div className="mt-10">
                <ul className="flex flex-wrap gap-x-6 gap-y-3" data-social-row="">
                  {profiles.map((p) => (
                    <li key={p.key}>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={dated && p.count ? `${p.name}, ${p.count} ${tr('section.followers')}` : p.name}
                        className="group inline-flex items-center gap-2.5 rounded-full text-sm font-semibold text-fam-ink focus-ring"
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-full bg-cta text-cta-foreground transition-transform group-hover:translate-y-(--hov-lift-sm)">
                          <SocialIcon platform={p.key} className="h-5 w-5" />
                        </span>
                        <span>{dated && p.count ? <><span className="font-display text-base">{p.count}</span> {p.name}</> : p.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                {dated && profiles.some((p) => p.count) && <p className="mt-3 text-xs text-fam-ink-muted">{note}</p>}
              </div>
            )}
          </div>

          {/* Image overlapped by a vivid magenta block, layered, off-grid. */}
          <div
            data-enter="up-late"
            className={`relative lg:col-span-5 ${hasText(kicker) ? 'lg:mt-11' : ''}`}
          >
            <div className="absolute -left-5 -top-5 -z-10 h-32 w-32 rounded-2xl bg-fam-accent" />
            <div className="overflow-hidden rounded-3xl elev-5">
              <img
                src={imageSrc(imageUrl)}
                alt={HERO_ALT}
                className="aspect-[4/5] w-full object-cover" data-hero-photo="" style={heroFocusStyle(site)} />
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
