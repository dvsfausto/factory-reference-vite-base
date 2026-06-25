import { Link } from '@tanstack/react-router'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

// CTA VARIANT: 'modern' — clean, restrained close. Identity copy from SITE.homeCta.
// A simple centered block with generous whitespace on white, a large geometric-
// sans headline, a brand CTA. No script, no leaf sprites, no brand gradient.
// Prop signature identical to CtaBlock; returns an Element (no null).
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (brand-
// owned); accent → emerald-* (DNA → indigo) eyebrow + secondary; rounded-* (DNA,
// restrained); font-display (DNA); cool light surface component-owned. No
// bg-brand-*, no .btn.
export function CtaModernBlock({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  const headline = title ?? SITE.homeCta.title
  const sub = subtitle ?? SITE.homeCta.subtitle
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          {SITE.tagline && (
            <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="h-px w-6 bg-emerald-600" />
              {SITE.tagline}
            </span>
          )}
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-[#0F172A] sm:text-5xl">
            {headline}
          </h2>
          {sub && (
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#64748B]">{sub}</p>
          )}
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-primary px-7 font-display text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Book an appointment <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-[#E6E8EC] px-6 font-display font-semibold text-[#0F172A] transition-colors hover:border-emerald-600 hover:text-emerald-700"
            >
              <Phone className="h-4 w-4 text-emerald-600" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
