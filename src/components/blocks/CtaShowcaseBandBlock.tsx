import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'
import { primaryCta, REQUEST_MODE } from '~/lib/primaryCta'
import { hasText } from '~/lib/has-text'
import { ShowcaseCta } from '~/components/showcase/ShowcaseCta'

// CTA VARIANT: 'showcase-band' (the Showcase theme, 2026-10-29). Centred on the white page between two short gold
// hairlines: ONE sentence in the display face and ONE square ink button. The sentence: block.params.heading, else the
// block's title, else SITE.homeCta.title, else the shared default. The label: block.params.label, else the site's CTA
// label, else the primary CTA's. The link: block.params.href (a site path or an https link), else the primary CTA.
export function CtaShowcaseBandBlock({
  site = SITE,
  title,
  heading,
  label,
  href,
}: {
  site?: typeof SITE
  title?: string
  subtitle?: string
  heading?: string
  label?: string
  href?: string
}) {
  const homeCta = (site as { homeCta?: { title?: string } }).homeCta
  const sentence = [heading, title, homeCta?.title].find((v) => hasText(v)) ?? tr('cta.readyWhenYouAre')
  const buttonLabel =
    (hasText(label) ? label : undefined) ??
    (site as { ctaLabel?: string }).ctaLabel ??
    (REQUEST_MODE ? tr('cta.checkAvailability') : primaryCta().label)
  const to = typeof href === 'string' && (/^\/(?!\/)/.test(href) || /^https:\/\//i.test(href)) ? href : undefined
  return (
    <section className="bg-fam-page">
      <div className="container-x py-section">
        <div className="mx-auto flex max-w-3xl flex-col items-center py-6 text-center md:py-16">
          <span aria-hidden="true" className="block h-px w-12 bg-fam-accent" />
          <h2 className="mt-10 text-balance font-display text-3xl font-normal leading-tight tracking-[-0.01em] text-fam-ink md:text-5xl">{sentence}</h2>
          <ShowcaseCta to={to} tone="ink" className="mt-10">{buttonLabel}</ShowcaseCta>
          <span aria-hidden="true" className="mt-12 block h-px w-12 bg-fam-accent" />
        </div>
      </div>
    </section>
  )
}
