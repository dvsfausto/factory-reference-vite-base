import type { Partner } from './partners-variants'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'

// Partners LAYOUT: 'with-text' — a two-column split: a heading + blurb beside the
// partner marks. Character-agnostic. Frames WHY the partnerships matter, not just
// the logos. OMIT-WHEN-ABSENT: SITE.partners via cast; none -> null. Missing logo
// -> monochrome wordmark.
//
// TOKEN DISCIPLINE: accent -> emerald-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned (white / slate /
// #E6E8EC). No CTA by design. Never bg-brand-* / .btn.
export function PartnersWithTextBlock({
  label = tr('section.partners'),
  heading = tr('section.betterTogether'),
  body = tr('section.partnersBody'),
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const partners = (SITE as { partners?: Partner[] }).partners
  if (!partners || partners.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">{heading}</h2>
            {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {partners.map((p, i) => (
              <div key={`${p.name}-${i}`} className="flex h-20 items-center justify-center rounded-2xl border border-[#E6E8EC] bg-white p-5">
                {p.logo ? (
                  <img src={p.logo} alt={p.name} loading="lazy" className="h-9 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0" />
                ) : (
                  <span className="text-center font-display text-base font-semibold tracking-tight text-[#64748B]">{p.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
