import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

import { hasPhone } from '~/lib/phone'
// CTA VARIANT: 'corporate', a formal, authoritative close on a deep navy band.
// Identity copy from SITE.homeCta. Heavy grotesque headline, structured, a brand
// CTA. No script, no leaf sprites, no soft gradient. Prop signature identical to
// CtaBlock; returns an Element (no null).
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (brand-
// owned); accent → emerald-* (DNA → navy) eyebrow (rendered light on the dark
// band) + secondary; rounded-* (DNA, tight); font-display (DNA). The deep-navy
// surface is component-owned. No bg-brand-*, no .btn.
export function CtaCorporateBlock({
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
    <section className="bg-[#142844] text-white">
      <div className="container-x py-16 md:py-20">
        <div className="max-w-3xl">
          {site.tagline && (
            <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
              <span className="h-0.5 w-7 bg-emerald-100" />
              {site.tagline}
            </span>
          )}
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {headline}
          </h2>
          {sub && (
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">{sub}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryCta
              className="inline-flex h-[52px] items-center gap-2 rounded-md bg-primary px-7 font-display text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            {hasPhone(site.phone) && (<a
              href={`tel:${site.phone}`}
              className="inline-flex h-[52px] items-center gap-2 rounded-md border border-white/30 px-6 font-display font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <Phone className="h-4 w-4" /> {site.phoneDisplay}
            </a>)}
          </div>
        </div>
      </div>
    </section>
  )
}
