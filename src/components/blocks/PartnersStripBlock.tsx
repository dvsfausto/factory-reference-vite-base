import type { Partner } from './partners-variants'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'

// Partners LAYOUT: 'strip', a compact single-row band of partner marks with an
// inline label. Character-agnostic, quiet. OMIT-WHEN-ABSENT: SITE.partners via
// cast; none -> null. Missing logo -> monochrome wordmark.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned (white / slate /
// hairline #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
export function PartnersStripBlock({
  site = SITE,
  label = tr('section.trustedBy'),
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const partners = (site as { partners?: Partner[] }).partners
  if (!partners || partners.length === 0) return null
  return (
    <section className="border-y border-[#E6E8EC] bg-white">
      <div className="container-x py-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
          <span className="shrink-0 font-display text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">{label}</span>
          <div className="flex flex-1 flex-wrap items-center justify-center gap-x-10 gap-y-5 md:justify-between">
            {partners.map((p, i) =>
              p.logo ? (
                <img key={`${p.name}-${i}`} src={p.logo} alt={p.name} loading="lazy" className="h-8 w-auto opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0" />
              ) : (
                <span key={`${p.name}-${i}`} className="font-display text-base font-semibold uppercase tracking-[0.1em] text-[#64748B]">{p.name}</span>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
