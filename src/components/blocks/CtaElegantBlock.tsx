import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { elegantSurface } from '~/lib/elegant-surface'
import { SITE } from '~/data/site'

// CTA VARIANT: 'elegant', refined close. Identity copy from SITE.homeCta. Surface
// from elegantSurface(): LIGHT by default (warm ivory band), DARK on opt-in
// (espresso band, the original, byte-identical). A thin emerald rule, a refined
// serif headline, a brand CTA. No script, no leaf sprites, no brand-gradient.
// Prop signature identical to CtaBlock; returns an Element (no null).
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (brand-
// owned); accent → emerald-* (DNA) rule + eyebrow; rounded-* (DNA); font-display
// (DNA serif); surface neutrals from elegantSurface(). No bg-brand-*, no .btn.
export function CtaElegantBlock({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  const s = elegantSurface()
  const headline = title ?? ((SITE as { homeCta?: { title?: string; subtitle?: string } }).homeCta?.title ?? tr('cta.readyToStart'))
  const sub = subtitle ?? ((SITE as { homeCta?: { title?: string; subtitle?: string } }).homeCta?.subtitle ?? 'Tell us what you need and we’ll take it from there.')
  const ctaLabel = ((SITE as { headerCtaLabel?: string }).headerCtaLabel ?? tr('form.getFreeQuote'))
  return (
    <section className={`relative isolate overflow-hidden ${s.section} ${s.text}`}>
      <div className="h-px w-full bg-emerald-600/50" />
      <div className="container-x py-24 md:py-28">
        <div className="max-w-3xl">
          {SITE.tagline && (
            <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-emerald-600">
              <span className="h-px w-8 bg-emerald-600" />
              {SITE.tagline}
            </span>
          )}
          <h2 className={`mt-6 font-display text-4xl font-medium leading-[1.08] tracking-tight ${s.text} sm:text-5xl lg:text-6xl`}>
            {headline}
          </h2>
          {sub && (
            <p className={`mt-5 max-w-xl text-lg leading-relaxed ${s.muted}`}>{sub}</p>
          )}
          <div className="mt-10 flex flex-wrap gap-4">
            <PrimaryCta
              className="inline-flex h-[54px] items-center gap-2 rounded-lg bg-primary px-8 font-display text-base font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            <a
              href={`tel:${SITE.phone}`}
              className={`inline-flex h-[54px] items-center gap-2 rounded-lg border border-emerald-600/60 px-7 font-medium ${s.text} transition-colors hover:border-emerald-600 hover:bg-emerald-600/10`}
            >
              <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
