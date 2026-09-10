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
// owned). Accent -> fam-accent-* (DNA) restricted to 50/100/600/700: fam-accent-soft-2
// eyebrow on dark, fam-accent rule. Radius -> rounded-* (DNA). Font -> font-
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
    <section className="bg-fam-surface-2">
      <div className="container-x py-section">
        <div className="relative isolate mx-auto max-w-4xl overflow-hidden rounded-3xl bg-fam-panel px-8 py-14 text-center shadow-(--elev-4) md:px-16 md:py-20">
          {site.tagline && (
            <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-fam-accent-on-dark">
              <span className="h-px w-7 bg-fam-accent" />
              {site.tagline}
            </span>
          )}
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-fam-on-dark sm:text-5xl">
            {headline}
          </h2>
          {sub && (
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-300">{sub}</p>
          )}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <PrimaryCta
              className="inline-flex h-[54px] items-center gap-2 rounded-xl bg-cta px-8 font-display text-base font-semibold text-cta-foreground transition-opacity hover:opacity-(--hov-fade)"
            >{tr('section.getStarted')}<ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            {hasPhone(site.phone) && (<a
              href={`tel:${site.phone}`}
              className="inline-flex h-[54px] items-center gap-2 rounded-xl border border-fam-card/25 px-7 font-display font-semibold text-fam-on-dark transition-colors hover:border-fam-accent hover:text-fam-accent-on-dark"
            >
              <Phone className="h-4 w-4 text-fam-accent-on-dark" /> {site.phoneDisplay}
            </a>)}
          </div>
        </div>
      </div>
    </section>
  )
}
