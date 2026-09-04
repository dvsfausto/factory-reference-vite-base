import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

import { hasPhone } from '~/lib/phone'
// CTA LAYOUT: 'boxed-card', the close lives inside a single elevated dark card
// floating on a light section, rather than spanning a full-width band. Character-
// agnostic. The contained, shadowed card reads as a deliberate object on the page
//, composed, not a stretched strip.
//
// Considered containment: a deep slate card with generous padding, a soft shadow
// and rounded corners, an emerald eyebrow rule, and the brand button set against
// the dark field for contrast.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700: emerald-100
// eyebrow on dark, emerald-600 rule. Radius -> rounded-* (DNA). Font -> font-
// display (DNA). Dark card (slate-950) component-owned. Never bg-brand-* / .btn.
//
// Identity copy read from SITE.homeCta via inline cast. Prop signature identical
// to CtaBlock; returns an Element (no null).
export function CtaBoxedCardBlock({
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
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="relative isolate mx-auto max-w-4xl overflow-hidden rounded-3xl bg-slate-950 px-8 py-14 text-center shadow-xl md:px-16 md:py-20">
          {site.tagline && (
            <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
              <span className="h-px w-7 bg-emerald-600" />
              {site.tagline}
            </span>
          )}
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            {headline}
          </h2>
          {sub && (
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-300">{sub}</p>
          )}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <PrimaryCta
              className="inline-flex h-[54px] items-center gap-2 rounded-xl bg-primary px-8 font-display text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >{tr('section.getStarted')}<ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            {hasPhone(site.phone) && (<a
              href={`tel:${site.phone}`}
              className="inline-flex h-[54px] items-center gap-2 rounded-xl border border-white/25 px-7 font-display font-semibold text-white transition-colors hover:border-emerald-600 hover:text-emerald-100"
            >
              <Phone className="h-4 w-4 text-emerald-100" /> {site.phoneDisplay}
            </a>)}
          </div>
        </div>
      </div>
    </section>
  )
}
