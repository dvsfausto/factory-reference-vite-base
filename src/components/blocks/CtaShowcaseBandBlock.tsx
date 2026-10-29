import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'
import { primaryCta, REQUEST_MODE } from '~/lib/primaryCta'
import { hasText } from '~/lib/has-text'
import { isShowcase } from '~/lib/editorial'
import { httpsOr } from '~/lib/showcase'
import { ShowcaseCta } from '~/components/showcase/ShowcaseCta'
import { GoldHeading, GoldRule } from '~/components/showcase/Primitives'

// CTA VARIANT: 'showcase-band' (the Showcase theme, 2026-10-29). Centred on the white page between two short gold hairlines:
// ONE sentence (uppercase display serif, the gold-word rule) and ONE square ink button.
//   sentence: params.heading > params.title > SITE.homeCta.title > the shared default
//   label:    params.buttonLabel > params.label > on a Showcase site "Start your custom piece", else SITE.ctaLabel > the primary CTA's
//   link:     params.buttonHref (https) > params.href (a site path or https) > on a Showcase site /contact (the contact form;
//             booking stays on /book), else the primary CTA
export function CtaShowcaseBandBlock({
  site = SITE,
  title,
  heading,
  label,
  href,
  buttonLabel,
  buttonHref,
}: {
  site?: typeof SITE
  title?: string
  subtitle?: string
  heading?: string
  label?: string
  href?: string
  buttonLabel?: string
  buttonHref?: string
}) {
  const homeCta = (site as { homeCta?: { title?: string } }).homeCta
  const sentence = [heading, title, homeCta?.title].find((v) => hasText(v)) ?? tr('cta.readyWhenYouAre')
  const showcase = isShowcase()
  const textLabel =
    [buttonLabel, label].find((v) => hasText(v)) ??
    (showcase ? tr('showcase.startCustom') : (site as { ctaLabel?: string }).ctaLabel ?? (REQUEST_MODE ? tr('cta.checkAvailability') : primaryCta().label))
  const path = typeof href === 'string' && (/^\/(?!\/)/.test(href) || /^https:\/\//i.test(href)) ? href : undefined
  const to = httpsOr(buttonHref, path ?? (showcase ? '/contact' : '')) || undefined
  return (
    <section className="bg-fam-page" data-showcase="cta">
      <div className="container-x py-section">
        <div className="mx-auto flex max-w-3xl flex-col items-center py-6 text-center md:py-16">
          <GoldRule />
          <GoldHeading text={sentence!} className="mt-10 text-balance text-3xl sm:text-4xl md:text-5xl" />
          <ShowcaseCta to={to} tone="ink" className="mt-12">{textLabel}</ShowcaseCta>
          <GoldRule className="mt-14" />
        </div>
      </div>
    </section>
  )
}
