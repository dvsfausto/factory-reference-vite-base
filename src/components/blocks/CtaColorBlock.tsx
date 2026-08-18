import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

// CTA LAYOUT: 'color-block' — a bold, intentional field of the brand color filling
// the full section, with the close set in inverted type on top. Character-agnostic.
// The saturated brand band is the design: high-contrast, confident, impossible to
// miss as the page's final ask.
//
// Inverted on purpose: the section IS bg-primary, so the primary action becomes a
// solid white button (max contrast on the brand field) and the secondary a quiet
// white-outline phone — a deliberate inversion, not an accident.
//
// TOKEN DISCIPLINE: the brand field is bg-primary / text-primary-foreground (BRAND-
// owned). Accent restrained to white/translucent on the field (emerald, when used
// elsewhere, stays 50/100/600/700). Radius -> rounded-* (DNA). Font -> font-display
// (DNA). Never bg-brand-* / .btn.
//
// Identity copy read from SITE.homeCta via inline cast (the SITE.surface / hero
// video_url precedent) so a missing field never breaks the type-check. Prop
// signature identical to CtaBlock; returns an Element (no null).
export function CtaColorBlock({
  title,
  subtitle,
}: {
  title?: string
  subtitle?: string
}) {
  const cta = (SITE as { homeCta?: { title?: string; subtitle?: string } }).homeCta
  const headline = title ?? cta?.title ?? 'Ready when you are.'
  const sub = subtitle ?? cta?.subtitle ?? tr('cta.reachOutToday')
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {SITE.tagline && (
            <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground/80">
              <span className="h-px w-7 bg-primary-foreground/50" />
              {SITE.tagline}
            </span>
          )}
          <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            {headline}
          </h2>
          {sub && (
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-primary-foreground/85">{sub}</p>
          )}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <PrimaryCta
              className="inline-flex h-[54px] items-center gap-2 rounded-xl bg-white px-8 font-display text-base font-semibold text-[#0F172A] transition-transform hover:-translate-y-0.5"
            >{tr('section.getStarted')}<ArrowRight className="h-4 w-4" />
            </PrimaryCta>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex h-[54px] items-center gap-2 rounded-xl border border-primary-foreground/40 px-7 font-display font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
