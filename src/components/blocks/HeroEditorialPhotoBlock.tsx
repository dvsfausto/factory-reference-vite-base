import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { PAGED_SERVICES as SERVICES } from '~/data/services-view'
import { tr } from '~/lib/i18n'
import { imageSrc } from '~/lib/asset-url'
import { heroFocusStyle } from '~/lib/hero-focus'
import { hasText } from '~/lib/has-text'
import { SELLS } from '~/lib/sells'
import { Kicker, EditorialHeading } from '~/components/editorial/Primitives'
import { EditorialPrimaryCta, EditorialLink } from '~/components/editorial/EditorialCta'

// Hero VARIANT: 'editorial-photo' (the Editorial theme, ZB-147 W1.2). The owner's photo full bleed and full height,
// a dark gradient rising from the foot of the frame, the words bottom-left: kicker, the split serif headline (the
// second sentence italic in the accent), one serif line, then the square light button and a text link beside it.
// A round scroll cue sits bottom-right on desktop. The header lays over it transparently on the home page
// (Header.tsx, the 'editorial-over' theme). Props match HeroBlock (trustItems / decorativeAsset are accepted and
// unused: this composition carries no trust row and no decoration). Renders server-side with no JavaScript: the
// entrance is the CSS data-enter animation, which ends visible whatever the bundle does.
export function HeroEditorialPhotoBlock({
  site = SITE,
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
}) {
  const hero = site.hero
  const secondaryTo = SELLS.services && SERVICES.length > 0 ? '/services' : '/about'
  const onCue = () => {
    if (typeof window === 'undefined') return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: reduce ? 'auto' : 'smooth' })
  }
  return (
    <section className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden bg-fam-statement-2 text-fam-on-statement md:min-h-svh">
      <img
        src={imageSrc(hero.image_url)}
        alt={HERO_ALT}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        data-hero-photo=""
        fetchPriority="high"
        style={heroFocusStyle(site)}
      />
      {/* the scrim: token-based opacity, darkest at the foot where the words sit */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-fam-statement-2/80 via-fam-statement-2/30 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-fam-statement-2/40 to-transparent" />

      <div data-enter="up" className="relative w-full px-5 pb-16 pt-36 md:px-[7%] md:pb-[10%]">
        <div className="max-w-4xl">
          {hasText(hero.kicker) && <Kicker onDark>{hero.kicker}</Kicker>}
          <EditorialHeading as="h1" size="xl" onDark text={hero.headline} className="mt-5" />
          {hasText(hero.subheadline) && (
            <p className="mt-6 max-w-[44rem] font-display text-xl leading-snug text-fam-on-statement">{hero.subheadline}</p>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <EditorialPrimaryCta tone="light">{hero.cta_primary_label}</EditorialPrimaryCta>
            {hasText(hero.cta_secondary_label) && (
              <EditorialLink to={secondaryTo} tone="link" className="text-fam-on-statement">{hero.cta_secondary_label}</EditorialLink>
            )}
          </div>
        </div>
      </div>

      {/* the scroll cue: desktop only, a quiet circle at the foot of the frame */}
      <button
        type="button"
        onClick={onCue}
        aria-label={tr('editorial.scrollDown')}
        className="absolute bottom-[10%] right-[7%] hidden h-11 w-11 items-center justify-center rounded-full border border-fam-on-statement/60 text-fam-on-statement transition-colors hover:border-fam-on-statement hover:bg-fam-on-statement/10 md:flex"
      >
        <span aria-hidden="true" className="text-base leading-none">&darr;</span>
      </button>
    </section>
  )
}
