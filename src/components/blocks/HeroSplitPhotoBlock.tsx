import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'
import { placeLine } from '~/lib/place'
import { primaryCta } from '~/lib/primaryCta'
import { hasText } from '~/lib/has-text'
import { faceSafeStyle } from '~/lib/editorial-media'
import { EditorialButton, EditorialHeading, Kicker } from '~/components/editorial/Primitives'

// INNER-PAGE HERO VARIANT: 'split-photo' (the Editorial look, ZB-147 W1.2). Two halves on desktop: the words on the
// cream page ground (kicker "<service> · <place>", the serif h1 whose second sentence goes italic gold, the subhead,
// the square dark button), the photo filling the other half at 640px or more. On a phone the photo comes first (4:5)
// and the words follow. Drop-in for SERVICE_HERO_VARIANTS (ComponentProps of HeroAuroraBlock): headline / body /
// imageUrl / imageFocus flow in from the route; `serviceName` and `cta` are the per-service extras the renderer adds
// for this variant (as it does for the banner). On the homepage it reads the site hero and the site-wide CTA.
export function HeroSplitPhotoBlock({
  site = SITE,
  headline = site.hero.headline,
  body = site.hero.body,
  imageUrl = site.hero.image_url,
  imageFocus = null,
  serviceName,
  cta: ctaOverride,
  secondary,
}: {
  site?: typeof SITE
  headline?: string
  body?: string
  subheadline?: string
  imageUrl?: string
  /** the photo's focal point when the owner set one; null → the face-safe default */
  imageFocus?: string | null
  trustItems?: string[]
  decorativeAsset?: string
  /** the service's heading name (the renderer passes it on a service page); absent → the place alone */
  serviceName?: string
  /** a per-service CTA (the service-detail route passes serviceCta(slug)); absent → the site-wide one */
  cta?: { href: string; label: string }
  /** a second path beside the first (request mode: "Check your date" → the inquiry form); absent → one button */
  secondary?: { href: string; label: string }
}) {
  const cta = ctaOverride ?? primaryCta()
  const kicker = [serviceName, placeLine(site)].filter(Boolean).join(' · ')
  return (
    <section className="bg-fam-page">
      <div className="grid grid-cols-1 lg:min-h-[640px] lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-center px-5 py-12 lg:order-1 lg:p-[7%]">
          {kicker && <Kicker>{kicker}</Kicker>}
          <EditorialHeading as="h1" text={headline} size="lg" className="mt-5" />
          {hasText(body) && <p className="mt-6 max-w-[34rem] font-sans text-[17px] leading-relaxed text-fam-ink-muted">{body}</p>}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <EditorialButton href={cta.href} tone="dark">{cta.label}</EditorialButton>
            {secondary && <EditorialButton href={secondary.href} tone="link">{secondary.label}</EditorialButton>}
          </div>
        </div>
        <div className="relative order-1 aspect-[4/5] bg-fam-surface-2 lg:order-2 lg:aspect-auto lg:min-h-[640px]">
          <img
            src={imageSrc(imageUrl)}
            alt={HERO_ALT}
            data-service-photo=""
            style={faceSafeStyle(imageFocus)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
