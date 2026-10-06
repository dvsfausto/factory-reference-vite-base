import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'
import { placeLine } from '~/lib/place'
import { primaryCta } from '~/lib/primaryCta'
import { hasText } from '~/lib/has-text'
import { Kicker, EditorialHeading } from '~/components/editorial/Primitives'
import { EditorialPrimaryCta } from '~/components/editorial/EditorialCta'

// CTA VARIANT: 'dark-band' (the Editorial theme, ZB-147 W1.2). Centred on the charcoal-green statement band:
// a kicker naming the place the business works, the split serif heading, one sans line, the square light button.
// Copy precedence as every CTA variant: a layout param > SITE.homeCta > the shared default words. The button's
// label and target come from the ONE primary-CTA resolver (an owner's own label still wins).
export function CtaDarkBandBlock({
  site = SITE,
  title,
  subtitle,
}: {
  site?: typeof SITE
  title?: string
  subtitle?: string
}) {
  const homeCta = (site as { homeCta?: { title?: string; subtitle?: string } }).homeCta
  const heading = title ?? homeCta?.title ?? tr('cta.readyWhenYouAre')
  const line = subtitle ?? homeCta?.subtitle ?? tr('cta.quote24')
  const label = (site as { ctaLabel?: string }).ctaLabel ?? primaryCta().label
  const place = placeLine(site)
  return (
    <section className="bg-fam-statement text-fam-on-statement">
      <div className="container-x py-band">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {place && <Kicker onDark>{place}</Kicker>}
          <EditorialHeading size="lg" onDark text={heading} className="mt-5" />
          {hasText(line) && <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-fam-on-statement-muted sm:text-lg">{line}</p>}
          <EditorialPrimaryCta tone="light" className="mt-10">{label}</EditorialPrimaryCta>
        </div>
      </div>
    </section>
  )
}
