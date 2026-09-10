import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

import { hasPhone } from '~/lib/phone'
// CTA LAYOUT: 'split-with-image', the close set beside a supporting photo: text
// and actions in one column, a framed image in the other. Character-agnostic. The
// image gives the final ask a human, concrete anchor instead of a bare band.
//
// The photo is DATA: it reuses the existing SITE.hero.image_url (resolved via
// imageSrc), so no new field is introduced and the image is always present.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> fam-accent-* (DNA) restricted to 50/100/600/700. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned
// (section #F8FAFC, slate text, #E6E8EC). Never bg-brand-* / .btn.
//
// Identity copy read from SITE.homeCta via inline cast. Prop signature identical
// to CtaBlock; returns an Element (no null).
export function CtaSplitWithImageBlock({
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
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            {site.tagline && (
              <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
                <span className="h-px w-6 bg-fam-accent" />
                {site.tagline}
              </span>
            )}
            <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-fam-ink sm:text-5xl">
              {headline}
            </h2>
            {sub && (
              <p className="mt-5 max-w-md text-lg leading-relaxed text-fam-ink-muted">{sub}</p>
            )}
            <div className="mt-9 flex flex-wrap gap-4">
              <PrimaryCta
                className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-cta px-7 font-display text-base font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)"
              >{tr('section.getStarted')}<ArrowRight className="h-4 w-4" />
              </PrimaryCta>
              {hasPhone(site.phone) && (<a
                href={`tel:${site.phone}`}
                className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-fam-hairline bg-fam-card px-6 font-display font-semibold text-fam-ink transition-colors hover:border-fam-accent hover:text-fam-accent-text-strong"
              >
                <Phone className="h-4 w-4 text-fam-accent-text" /> {site.phoneDisplay}
              </a>)}
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-fam-hairline shadow-(--elev-1)">
            <img
              src={imageSrc(site.hero.image_url)}
              alt={HERO_ALT}
              loading="lazy"
              width={900}
              height={675}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
