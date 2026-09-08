import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

import { hasPhone } from '~/lib/phone'
// CTA VARIANT: 'friendly', warm, inviting close. Identity copy from SITE.homeCta.
// A soft coral-tinted rounded panel (centered, welcoming), rounded friendly type,
// a rounded brand CTA. No script, no leaf sprites, no brand gradient. Prop
// signature identical to CtaBlock; returns an Element (no null).
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (brand-
// owned); accent → emerald-* (DNA → coral) panel tint + secondary CTA; rounded-*
// (DNA, soft); font-display (DNA). Light-warm surface component-owned. No
// bg-brand-*, no .btn.
export function CtaFriendlyBlock({
  site = SITE,
  title,
  subtitle,
}: {
  site?: typeof SITE
  title?: string
  subtitle?: string
}) {
  const headline = title ?? ((site as { homeCta?: { title?: string; subtitle?: string } }).homeCta?.title ?? tr('cta.readyToStart'))
  const sub = subtitle ?? ((site as { homeCta?: { title?: string; subtitle?: string } }).homeCta?.subtitle ?? 'Tell us what you need and we’ll take it from there.')
  const ctaLabel = ((site as { headerCtaLabel?: string }).headerCtaLabel ?? tr('form.getFreeQuote'))
  return (
    <section className="bg-fam-surface">
      <div className="container-x py-section">
        <div className="rounded-3xl border border-fam-hairline bg-fam-accent-soft px-8 py-14 text-center shadow-sm md:px-16">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-fam-ink sm:text-4xl">
            {headline}
          </h2>
          {sub && (
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-fam-ink-muted">{sub}</p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <PrimaryCta
              className="inline-flex h-[54px] items-center gap-2 rounded-2xl bg-cta px-8 font-display text-base font-semibold text-cta-foreground shadow-lg transition-opacity hover:opacity-90"
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            {hasPhone(site.phone) && (<a
              href={`tel:${site.phone}`}
              className="inline-flex h-[54px] items-center gap-2 rounded-2xl border-2 border-fam-accent/40 bg-white px-7 font-display font-semibold text-fam-ink transition-colors hover:border-fam-accent hover:bg-fam-accent-soft"
            >
              <Phone className="h-4 w-4 text-fam-accent-text" /> {site.phoneDisplay}
            </a>)}
          </div>
        </div>
      </div>
    </section>
  )
}
