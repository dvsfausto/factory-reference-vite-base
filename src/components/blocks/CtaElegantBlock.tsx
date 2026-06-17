import { Link } from '@tanstack/react-router'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

// CTA VARIANT: 'elegant' — dark-luxury close. Mirrors CtaBoldBlock's data
// discipline (title/subtitle from SITE.homeCta) but warm and unhurried: a deep
// espresso band with a thin amber rule, a refined serif headline, and a square-
// soft brand CTA. No script flourish, no leaf sprites, no brand-gradient.
// Prop signature identical to CtaBlock; returns an Element (no null).
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (brand-
// owned); accent → emerald-* (DNA → amber) rule + eyebrow; rounded-* (DNA); font-
// display (DNA serif); warm-dark surface component-owned. No bg-brand-*, no .btn.
export function CtaElegantBlock({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  const headline = title ?? SITE.homeCta.title
  const sub = subtitle ?? SITE.homeCta.subtitle
  return (
    <section className="relative isolate overflow-hidden bg-[#1A1410] text-[#F2E8DC]">
      <div className="h-px w-full bg-emerald-600/50" />
      <div className="container-x py-24 md:py-28">
        <div className="max-w-3xl">
          {SITE.tagline && (
            <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-emerald-600">
              <span className="h-px w-8 bg-emerald-600" />
              {SITE.tagline}
            </span>
          )}
          <h2 className="mt-6 font-display text-4xl font-medium leading-[1.08] tracking-tight text-[#F2E8DC] sm:text-5xl lg:text-6xl">
            {headline}
          </h2>
          {sub && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#B8A893]">{sub}</p>
          )}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="inline-flex h-[54px] items-center gap-2 rounded-lg bg-primary px-8 font-display text-base font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              Reserve a visit <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-[54px] items-center gap-2 rounded-lg border border-emerald-600/60 px-7 font-medium text-[#F2E8DC] transition-colors hover:border-emerald-600 hover:bg-emerald-600/10"
            >
              <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
