import type { Partner } from './partners-variants'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'

// Partners LAYOUT: 'logo-wall', a centered multi-row wall of partner logos.
// Character-agnostic. OMIT-WHEN-ABSENT: SITE.partners via cast; none -> null.
// Missing logo -> the partner name as a monochrome wordmark.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) 50/100/600/700. Radius -> rounded-*
// (DNA). Font -> font-display (DNA). Light surface component-owned (white / slate).
// No CTA by design. Never bg-brand-* / .btn.
export function PartnersLogoWallBlock({
  site = SITE,
  label = tr('section.partners'),
  heading = tr('section.trustedPartners'),
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
    <section className="bg-white">
      <div className="container-x py-section">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading}</h2>
          {body && <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-10">
          {partners.map((p, i) =>
            p.logo ? (
              <img key={`${p.name}-${i}`} src={p.logo} alt={p.name} loading="lazy" className="h-10 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0" />
            ) : (
              <span key={`${p.name}-${i}`} className="font-display text-xl font-semibold tracking-tight text-fam-ink-muted transition-colors hover:text-fam-ink">{p.name}</span>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
