import type { Partner } from './partners-variants'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'

// Partners LAYOUT: 'grid', partner marks set in a framed grid of bordered cells
// (shared hairlines). Character-agnostic, structured. OMIT-WHEN-ABSENT:
// SITE.partners via cast; none -> null. Missing logo -> monochrome wordmark.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700. Radius -> rounded-*
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
    <section className="bg-fam-surface-2">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-fam-hairline bg-fam-hairline sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((p, i) => (
            <div key={`${p.name}-${i}`} className="flex min-h-[120px] items-center justify-center bg-white p-8">
              {p.logo ? (
                <img src={p.logo} alt={p.name} loading="lazy" className="h-10 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0" />
              ) : (
                <span className="font-display text-lg font-semibold tracking-tight text-fam-ink-muted">{p.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
