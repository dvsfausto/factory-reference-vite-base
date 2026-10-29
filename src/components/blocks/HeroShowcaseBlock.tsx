import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'
import { heroFocusStyle } from '~/lib/hero-focus'
import { GoldHeading } from '~/components/showcase/Primitives'

/* ★ THE LOGO IN THE HERO (2026-10-29). SITE.heroLogo (boolean, any hero may honour it later): the Showcase hero shows the
   business's logo large above the headline only when it is true (off by default: the Showcase header carries
   the logo large and centred). Legible over any photo, and the file is never altered:
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

// Hero VARIANT: 'showcase' (the Showcase theme, 2026-10-29). ONE photo filling the screen under the header and ONE big
// uppercase serif headline centred on it (hero.headline, the gold-word rule), over a soft scrim. No button, no kicker, no body,
// no trust row (booking lives on /book only on a Showcase site). A video plays instead of the photo when SITE.hero.video_url
// is set (the photo is its poster), the same data path as the 'video' hero. Props match HeroBlock. Server-rendered, no JS.
export function HeroShowcaseBlock({
  site = SITE,
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
}) {
  const hero = site.hero
  const videoUrl = (hero as { video_url?: string }).video_url
  const showLogo = (site as { heroLogo?: boolean }).heroLogo === true && !!(site as { logo_url?: string }).logo_url
  const media = 'absolute inset-0 -z-20 h-full w-full object-cover'
  return (
    // the Showcase header bar is 88px on a phone and 120px from lg up (plus its hairline): the photo ends at the fold
    <section className="relative isolate flex min-h-[calc(100svh-89px)] flex-col items-center justify-center overflow-hidden bg-fam-statement-2 text-fam-on-statement lg:min-h-[calc(100svh-121px)]">
      {videoUrl ? (
        <video autoPlay muted loop playsInline poster={imageSrc(hero.image_url)} className={media} style={heroFocusStyle(site)}>
          <source src={videoUrl} />
        </video>
      ) : (
        <img src={imageSrc(hero.image_url)} alt={HERO_ALT} className={media} data-hero-photo="" fetchPriority="high" style={heroFocusStyle(site)} />
      )}
      {/* the scrim: an even soft veil, a little deeper at the centre line where the words sit */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-fam-statement-2/25" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-fam-statement-2/20 to-transparent" />
      <div data-enter="up" className="flex w-full flex-col items-center px-5 py-24 text-center sm:px-8">
        {showLogo && <div className="mb-10"><HeroLogo site={site} /></div>}
        <GoldHeading
          as="h1"
          text={hero.headline}
          onDark
          className="max-w-5xl text-balance text-[40px] sm:text-6xl md:text-7xl lg:text-[96px]"
        />
      </div>
    </section>
  )
}
