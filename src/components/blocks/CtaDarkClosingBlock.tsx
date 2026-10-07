import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'
import { placeLine } from '~/lib/place'
import { primaryCta, REQUEST_MODE } from '~/lib/primaryCta'
import { hasText } from '~/lib/has-text'
import { Kicker, EditorialHeading } from '~/components/editorial/Primitives'
import { EditorialPrimaryCta } from '~/components/editorial/EditorialCta'

// CTA VARIANT: 'dark-closing' (the Editorial theme, ZB-147 W1.2). The last section before the footer: left-aligned
// on the near-black close, a kicker, the split serif heading, one sans line, the square light button. No bottom
// rule, so it runs straight into the footer's own top hairline. Copy precedence and the button as CtaDarkBandBlock.
export function CtaDarkClosingBlock({
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
  // request mode: the band asks for availability (the owner's own label still wins)
  const label = (site as { ctaLabel?: string }).ctaLabel ?? (REQUEST_MODE ? tr('cta.checkAvailability') : primaryCta().label)
  const place = placeLine(site)
  return (
    <section className="bg-fam-statement-2 text-fam-on-statement">
      <div className="container-x py-band">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            {place && <Kicker onDark>{place}</Kicker>}
            <EditorialHeading size="lg" onDark text={heading} className="mt-5" />
            {hasText(line) && <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-fam-on-statement-muted sm:text-lg">{line}</p>}
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <EditorialPrimaryCta tone="light">{label}</EditorialPrimaryCta>
          </div>
        </div>
      </div>
    </section>
  )
}
