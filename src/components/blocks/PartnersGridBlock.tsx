import type { Partner } from './partners-variants'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'

// Partners LAYOUT: 'grid', partner marks set in a framed grid of bordered cells
// (shared hairlines). Character-agnostic, structured. OMIT-WHEN-ABSENT:
// SITE.partners via cast; none -> null. Missing logo -> monochrome wordmark.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Cool surface component-owned (#F8FAFC / white
// cells / hairline #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
export function PartnersGridBlock({
  site = SITE,
  label = tr('section.partners'),
  heading = tr('section.ourPartners'),
  body,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
}) {
  const partners = (site as { partners?: Partner[] }).partners
  if (!partners || partners.length === 0) return null
  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            <span className="h-px w-6 bg-emerald-600" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
        </div>
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#E6E8EC] bg-[#E6E8EC] sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((p, i) => (
            <div key={`${p.name}-${i}`} className="flex min-h-[120px] items-center justify-center bg-white p-8">
              {p.logo ? (
                <img src={p.logo} alt={p.name} loading="lazy" className="h-10 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0" />
              ) : (
                <span className="font-display text-lg font-semibold tracking-tight text-[#64748B]">{p.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
