import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowUpRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'

import { hasPhone } from '~/lib/phone'
// CTA VARIANT: 'creative', the signature color-forward statement: a full vivid
// magenta color block (the DNA accent used as the whole surface field), an
// oversized expressive headline, and a bold brand CTA. The boldest, most
// design-led moment on the page. Identity copy from SITE.homeCta. Prop signature
// identical to CtaBlock; returns an Element (no null).
//
// TOKEN DISCIPLINE: primary CTA → bg-primary / text-primary-foreground (brand-
// owned, lands on the magenta field for a bold creative contrast). The magenta
// surface is the DNA accent (emerald role) used as a color block. Radius →
// rounded-* (DNA, large); font-display (DNA). No bg-brand-*, no .btn.
export function CtaCreativeBlock({
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
  return (
    <section className="bg-emerald-600 text-white">
      <div className="container-x py-24 md:py-32">
        <div className="max-w-3xl">
          {site.tagline && (
            <span className="inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.14em] text-white">
              <span className="inline-block h-4 w-4 rounded bg-white" />
              {site.tagline}
            </span>
          )}
          <h2 className="mt-5 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {headline}
          </h2>
          {sub && (
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-white/90">{sub}</p>
          )}
          <div className="mt-10 flex flex-wrap gap-4">
            <PrimaryCta
              className="inline-flex h-[56px] items-center gap-2 rounded-2xl bg-primary px-8 font-display text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >{tr('cta.startProject')}<ArrowUpRight className="h-5 w-5" />
            </PrimaryCta>
            {hasPhone(site.phone) && (<a
              href={`tel:${site.phone}`}
              className="inline-flex h-[56px] items-center gap-2 rounded-2xl border-2 border-white px-7 font-display font-bold text-white transition-colors hover:bg-white hover:text-emerald-700"
            >
              <Phone className="h-4 w-4" /> {site.phoneDisplay}
            </a>)}
          </div>
        </div>
      </div>
    </section>
  )
}
