import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

import { hasPhone } from '~/lib/phone'
// CTA VARIANT: 'modern', clean, restrained close. Identity copy from SITE.homeCta.
// A simple centered block with generous whitespace on white, a large geometric-
// sans headline, a brand CTA. No script, no leaf sprites, no brand gradient.
// Prop signature identical to CtaBlock; returns an Element (no null).
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (brand-
// owned); accent → emerald-* (DNA → indigo) eyebrow + secondary; rounded-* (DNA,
// restrained); font-display (DNA); cool light surface component-owned. No
// bg-brand-*, no .btn.
export function CtaModernBlock({
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
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="mx-auto max-w-2xl text-center">
          {site.tagline && (
            <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
              <span className="h-px w-6 bg-fam-accent" />
              {site.tagline}
            </span>
          )}
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-fam-ink sm:text-5xl">
            {headline}
          </h2>
          {sub && (
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-fam-ink-muted">{sub}</p>
          )}
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <PrimaryCta
              className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-cta px-7 font-display text-base font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)"
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            {hasPhone(site.phone) && (<a
              href={`tel:${site.phone}`}
              className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-fam-hairline px-6 font-display font-semibold text-fam-ink transition-colors hover:border-fam-accent hover:text-fam-accent-text-strong"
            >
              <Phone className="h-4 w-4 text-fam-accent-text" /> {site.phoneDisplay}
            </a>)}
          </div>
        </div>
      </div>
    </section>
  )
}
