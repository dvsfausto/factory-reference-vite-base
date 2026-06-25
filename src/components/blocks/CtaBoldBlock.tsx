import { Link } from '@tanstack/react-router'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

// CTA VARIANT: 'bold' — matches the hero's weight. The default CtaBlock/
// CTASection uses a brand-gradient band + a font-script accent word + leaf
// sprites + .btn-white/.btn-outline-white pills — all soft/wellness signals.
// This variant is blocky and confident: a solid dark ink band, an emerald accent
// rule, a heavy UPPERCASE Oswald headline, and a square brand-colored CTA.
//
// TOKEN DISCIPLINE (catalog reference): primary CTA uses bg-primary /
// text-primary-foreground (brand-owned, so a customer's kit lands on it);
// emerald-* is the DNA accent (the top rule + eyebrow); rounded-* square corners
// (DNA radius, not the .btn pill); font-display (DNA Oswald). Neutrals ink-*/
// white. Never bg-brand-* / .btn-primary (literal hex) and never .btn (pill).
//
// IDENTITY COPY is DATA — title/subtitle read from SITE.homeCta (promoted out of
// the JSX defaults by the scaffolder). Prop signature identical to CtaBlock.
export function CtaBoldBlock({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  const headline = title ?? ((SITE as { homeCta?: { title?: string; subtitle?: string } }).homeCta?.title ?? 'Ready to get started?')
  const sub = subtitle ?? ((SITE as { homeCta?: { title?: string; subtitle?: string } }).homeCta?.subtitle ?? 'Tell us what you need and we’ll take it from there.')
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-white">
      {/* Emerald accent rule across the top — the DNA accent as a structural band. */}
      <div className="h-1.5 w-full bg-emerald-600" />
      <div className="container-x py-20 md:py-24">
        <div className="max-w-3xl">
          {SITE.tagline && (
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-ink-100">
              <span className="inline-block h-3 w-3 bg-emerald-600" />
              {SITE.tagline}
            </span>
          )}
          <h2 className="mt-5 font-display text-4xl font-bold uppercase leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {headline}
          </h2>
          {sub && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-100/85">{sub}</p>
          )}
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="inline-flex h-[54px] items-center gap-2 rounded-md bg-primary px-8 font-display text-base font-semibold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get a free estimate <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-[54px] items-center gap-2 rounded-md border border-white/35 px-7 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
