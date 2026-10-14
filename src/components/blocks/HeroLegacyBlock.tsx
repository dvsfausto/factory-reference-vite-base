import { ArrowUpRight } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'
import { hasText } from '~/lib/has-text'
import { primaryCta } from '~/lib/primaryCta'
import { faceSafeStyle } from '~/lib/editorial-media'
import { PrimaryCta } from './PrimaryCta'

// HOMEPAGE HERO VARIANT: 'legacy' (2026-10-14). The words large and uppercase on the left over the page ground, the
// owner's photo filling the right of the band and fading into the ground behind the words; on a phone the photo fills
// the band and the words sit at the bottom over a fade. The headline's last word takes the accent. Every line is the
// site's own: kicker, headline, body then subheadline, the affordance button, and the trust points as one small line
// under it (each only with its data). No photo → the words alone on the ground.
export function HeroLegacyBlock({
  site = SITE,
  trustItems,
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
}) {
  const hero = site.hero as typeof site.hero & { kicker?: string; image_focus?: string | null }
  const cta = primaryCta()
  const photo = hasText(hero.image_url)
  // the last word (with its punctuation) in the accent; a one-word headline stays whole
  const words = (hero.headline ?? '').trim().split(/\s+/)
  const lead = words.length > 1 ? words.slice(0, -1).join(' ') : words.join(' ')
  const last = words.length > 1 ? words[words.length - 1] : ''
  const facts = (trustItems ?? []).filter(hasText).slice(0, 3)
  return (
    <section className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-fam-page text-fam-ink lg:min-h-[740px] lg:items-center" data-hero-legacy="">
      {photo && (
        <div className="absolute inset-0 -z-10 lg:left-auto lg:w-[62%]">
          <img
            src={imageSrc(hero.image_url)}
            alt={HERO_ALT}
            fetchPriority="high"
            style={faceSafeStyle(hero.image_focus)}
            className="h-full w-full object-cover"
          />
          {/* phone: the fade rises from the bottom under the words; desktop: it runs in from the left edge */}
          <div className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-fam-page)_8%,color-mix(in_oklab,var(--color-fam-page)_70%,transparent)_48%,transparent_85%)] lg:bg-[linear-gradient(90deg,var(--color-fam-page)_0%,color-mix(in_oklab,var(--color-fam-page)_55%,transparent)_30%,transparent_70%),linear-gradient(0deg,color-mix(in_oklab,var(--color-fam-page)_50%,transparent),transparent_45%)]" />
        </div>
      )}
      <div className="container-x relative w-full pb-12 pt-40 lg:py-section">
        <div className="max-w-[44rem]">
          {hasText(hero.kicker) && (
            <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-fam-ink">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-fam-accent" />
              {hero.kicker}
            </p>
          )}
          <h1 className="mt-6 font-display text-[clamp(3.25rem,8vw,7rem)] font-bold uppercase leading-[0.92] tracking-[-0.01em] text-fam-ink">
            {lead}
            {last && <> <span className="text-fam-accent-text">{last}</span></>}
          </h1>
          {(hasText(hero.body) || hasText(hero.subheadline)) && (
            <div className="mt-7 max-w-[24rem] space-y-1 text-base leading-relaxed text-fam-ink-muted">
              {hasText(hero.body) && <p>{hero.body}</p>}
              {hasText(hero.subheadline) && <p>{hero.subheadline}</p>}
            </div>
          )}
          <PrimaryCta
            className="mt-8 inline-flex items-center gap-7 bg-fam-accent px-6 py-4 text-sm font-bold text-fam-on-accent transition-[filter] hover:brightness-(--hov-shade)"
          >
            {cta.label}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </PrimaryCta>
          {facts.length > 0 && (
            <p className="mt-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-fam-ink-muted lg:mt-14">
              {facts.join('  /  ')}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
