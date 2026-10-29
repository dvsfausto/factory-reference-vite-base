import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'
import { heroFocusStyle } from '~/lib/hero-focus'
import { ShowcaseCta } from '~/components/showcase/ShowcaseCta'
import { logoSizeOf, sizedLogoHeight, logoBarPx } from '~/lib/chrome-extras'

/* ★ THE LOGO IN THE HERO (2026-10-29). SITE.heroLogo (boolean, any hero may honour it later): the Showcase hero shows the
   business's logo large above the headline unless it is false. Legible over any photo, and the file is never altered:
     · a distinct knockout (logo_light_url, not a copy of the logo) or a mark measured light (SITE.logoTone = 'light')
       stands on the photo as it is, the scrim under it;
     · every other logo (a dark mark, a JPEG on white) sits on a white plate, so its own white ground reads as the plate.
   The box is tall (128px on a phone, 192px from md up) because many uploaded logos carry wide white padding around a small
   mark; a wide wordmark is held by a max width and letterboxed on the plate instead of running off the screen. */
function HeroLogo({ site }: { site: typeof SITE }) {
  const s = site as { logo_url?: string; logo_light_url?: string; logoTone?: string; name: string }
  if (!s.logo_url) return null
  const knockout = s.logo_light_url && s.logo_light_url !== s.logo_url ? s.logo_light_url : s.logoTone === 'light' ? s.logo_url : ''
  const img = 'block h-32 w-auto max-w-[72vw] object-contain md:h-48 md:max-w-[420px]'
  if (knockout) return <img src={knockout} alt={s.name} className={img} data-hero-logo="knockout" />
  return (
    <span className="inline-block bg-fam-page" data-hero-logo="plate">
      <img src={s.logo_url} alt={s.name} className={img} />
    </span>
  )
}

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
  const showLogo = (site as { heroLogo?: boolean }).heroLogo !== false && !!(site as { logo_url?: string }).logo_url
  // the header's desktop bar grows for a large logo (Header.tsx barGrow): the photo still ends at the fold
  const size = logoSizeOf()
  const grown = !!size && logoBarPx(96, sizedLogoHeight(72, 'desktop', size)) > 96
  return (
    <section className={`relative isolate flex min-h-[calc(100svh-6rem)] ${grown ? 'lg:min-h-[calc(100svh-105px)] ' : ''}flex-col justify-end overflow-hidden bg-fam-statement-2 text-fam-on-statement`}>
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
        {showLogo && <div className="mb-8 md:mb-10"><HeroLogo site={site} /></div>}
        <h1 className="max-w-4xl text-balance font-display text-[44px] font-normal leading-[1.02] tracking-[-0.02em] text-fam-on-statement sm:text-6xl md:text-7xl lg:text-[88px]">
          {hero.headline}
        </h1>
        <ShowcaseCta tone="light" className="mt-9 md:mt-10">{hero.cta_primary_label}</ShowcaseCta>
      </div>
    </section>
  )
}
