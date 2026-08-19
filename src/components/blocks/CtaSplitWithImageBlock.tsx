import { PrimaryCta } from './PrimaryCta'
import { tr } from '~/lib/i18n'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'

// CTA LAYOUT: 'split-with-image', the close set beside a supporting photo: text
// and actions in one column, a framed image in the other. Character-agnostic. The
// image gives the final ask a human, concrete anchor instead of a bare band.
//
// The photo is DATA: it reuses the existing SITE.hero.image_url (resolved via
// imageSrc), so no new field is introduced and the image is always present.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> emerald-* (DNA) restricted to 50/100/600/700. Radius ->
// rounded-* (DNA). Font -> font-display (DNA). Light surface component-owned
// (section #F8FAFC, slate text, #E6E8EC). Never bg-brand-* / .btn.
//
// Identity copy read from SITE.homeCta via inline cast. Prop signature identical
// to CtaBlock; returns an Element (no null).
export function CtaSplitWithImageBlock({
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
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            {SITE.tagline && (
              <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                <span className="h-px w-6 bg-emerald-600" />
                {SITE.tagline}
              </span>
            )}
            <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-[#0F172A] sm:text-5xl">
              {headline}
            </h2>
            {sub && (
              <p className="mt-5 max-w-md text-lg leading-relaxed text-[#64748B]">{sub}</p>
            )}
            <div className="mt-9 flex flex-wrap gap-4">
              <PrimaryCta
                className="inline-flex h-[52px] items-center gap-2 rounded-xl bg-primary px-7 font-display text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >{tr('section.getStarted')}<ArrowRight className="h-4 w-4" />
              </PrimaryCta>
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-[#E6E8EC] bg-white px-6 font-display font-semibold text-[#0F172A] transition-colors hover:border-emerald-600 hover:text-emerald-700"
              >
                <Phone className="h-4 w-4 text-emerald-600" /> {SITE.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-[#E6E8EC] shadow-sm">
            <img
              src={imageSrc(SITE.hero.image_url)}
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
