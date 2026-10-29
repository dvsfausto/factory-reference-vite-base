import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'
import { heroFocusStyle } from '~/lib/hero-focus'
import { ShowcaseCta } from '~/components/showcase/ShowcaseCta'

// Hero VARIANT: 'showcase' (the Showcase theme, 2026-10-29). ONE photo filling the screen under the header, the
// headline alone in the display face bottom-left over a soft scrim rising from the foot, and ONE button: the site's
// primary call to action (PrimaryCta, the same target every hero uses). No kicker, no body, no trust row, no phone.
// Props match HeroBlock (trustItems / decorativeAsset are accepted and unused). Renders server-side with no JavaScript.
export function HeroShowcaseBlock({
  site = SITE,
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
}) {
  const hero = site.hero
  return (
    <section className="relative isolate flex min-h-[calc(100svh-6rem)] flex-col justify-end overflow-hidden bg-fam-statement-2 text-fam-on-statement">
      <img
        src={imageSrc(hero.image_url)}
        alt={HERO_ALT}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        data-hero-photo=""
        fetchPriority="high"
        style={heroFocusStyle(site)}
      />
      {/* the scrim: only at the foot, where the words sit, so the photo stays the photo */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-fam-statement-2/65 via-fam-statement-2/20 to-transparent" />
      <div data-enter="up" className="w-full px-5 pb-14 pt-40 sm:px-8 md:px-[6%] md:pb-20">
        <h1 className="max-w-4xl text-balance font-display text-[44px] font-normal leading-[1.02] tracking-[-0.02em] text-fam-on-statement sm:text-6xl md:text-7xl lg:text-[88px]">
          {hero.headline}
        </h1>
        <ShowcaseCta tone="light" className="mt-9 md:mt-10">{hero.cta_primary_label}</ShowcaseCta>
      </div>
    </section>
  )
}
