import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

// CTA LAYOUT: 'stacked-centered', a single, oversized centered close in a deep
// field of whitespace: eyebrow, display-scale headline, sub, and a centered action
// stack. Character-agnostic. Distinct through restraint and type drama, the final
// ask gets the whole stage and nothing competes with it.
//
// Drama, not emptiness: a genuine display type scale (up to text-7xl, tight
// leading) and very deep vertical padding so the close lands with weight.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned
// (white / slate). Never bg-brand-* / .btn.
//
// Identity copy read from SITE.homeCta via inline cast. Prop signature identical
// to CtaBlock; returns an Element (no null).
export function CtaStackedCenteredBlock({
  site = SITE,
  title,
  subtitle,
}: {
  site?: typeof SITE
  title?: string
  subtitle?: string
}) {
  const cta = (site as { homeCta?: { title?: string; subtitle?: string } }).homeCta
  const headline = title ?? cta?.title ?? 'Ready when you are.'
  const sub = subtitle ?? cta?.subtitle ?? tr('cta.reachOutToday')
  return (
    <section className="bg-white">
      <div className="container-x py-28 md:py-40">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {site.tagline && (
            <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              <span className="h-px w-10 bg-emerald-600" />
              {site.tagline}
              <span className="h-px w-10 bg-emerald-600" />
            </span>
          )}
          <h2 className="mt-8 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-[#0F172A] sm:text-6xl lg:text-7xl">
            {headline}
          </h2>
          {sub && (
            <p className="mt-7 max-w-xl text-xl leading-relaxed text-[#64748B]">{sub}</p>
          )}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <PrimaryCta
              className="inline-flex h-[56px] items-center gap-2 rounded-xl bg-primary px-8 font-display text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >{tr('section.getStarted')}<ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            <a
              href={`tel:${site.phone}`}
              className="inline-flex h-[56px] items-center gap-2 rounded-xl px-6 font-display font-semibold text-[#0F172A] transition-colors hover:text-emerald-700"
            >
              <Phone className="h-4 w-4 text-emerald-600" /> {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
