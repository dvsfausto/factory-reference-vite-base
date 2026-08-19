import { PrimaryCta } from './PrimaryCta'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

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
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  const headline = title ?? ((SITE as { homeCta?: { title?: string; subtitle?: string } }).homeCta?.title ?? 'Ready to get started?')
  const sub = subtitle ?? ((SITE as { homeCta?: { title?: string; subtitle?: string } }).homeCta?.subtitle ?? 'Tell us what you need and we’ll take it from there.')
  const ctaLabel = ((SITE as { headerCtaLabel?: string }).headerCtaLabel ?? 'Get a free quote')
  return (
    <section className="bg-[#FFFBF5]">
      <div className="container-x py-16 md:py-20">
        <div className="rounded-3xl border border-[#F0E6DA] bg-emerald-50 px-8 py-14 text-center shadow-sm md:px-16">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-[#3D3530] sm:text-4xl">
            {headline}
          </h2>
          {sub && (
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#7A6F66]">{sub}</p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <PrimaryCta
              className="inline-flex h-[54px] items-center gap-2 rounded-2xl bg-primary px-8 font-display text-base font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90"
            >
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-[54px] items-center gap-2 rounded-2xl border-2 border-emerald-600/40 bg-white px-7 font-display font-semibold text-[#3D3530] transition-colors hover:border-emerald-600 hover:bg-emerald-50"
            >
              <Phone className="h-4 w-4 text-emerald-600" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
