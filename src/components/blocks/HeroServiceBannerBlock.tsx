import { PrimaryCta } from './PrimaryCta'
import { ArrowRight, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { HERO_ALT } from '~/data/images'
import { imageSrc } from '~/lib/asset-url'
import { primaryCta } from '~/lib/primaryCta'

// INNER-PAGE HERO VARIANT: 'banner' — a COMPACT, FAMILY-AWARE banner for service / area / info DETAIL pages
// (Phase 2 opener). It replaces the WOW `aurora` inner hero, which was two problems at once: (1) 100vh, so a
// service page opened with a full-screen poster and pushed the actual content below the fold — a homepage hero
// earns the height, an inner-page hero does not; (2) a dark brand-gradient composition that ignored the site's
// design-wave family, so it sat off-family above the (now token-driven) body. This banner fixes both: it is
// short (image · title · one line · CTA), and every surface/ink/accent reads the global --fam-* tokens so it
// MATCHES the family. Chained var(--fam-x, var(--color-x)) fallbacks keep non-family sites clean (a neutral
// light banner) — better for the reader than a full-screen hero either way.
//
// Drop-in for the SERVICE_HERO_VARIANTS signature (ComponentProps of HeroAuroraBlock): per-item content flows
// in via headline / body / imageUrl / trustItems from the route (ctx.service|area|info). `subheadline` and
// `decorativeAsset` are accepted for parity and unused here. CTA → the affordance-correct primaryCta().
export function HeroServiceBannerBlock({
  site = SITE,
  headline = site.hero.headline,
  body = site.hero.body,
  imageUrl = site.hero.image_url,
  trustItems,
  cta: ctaOverride,
}: {
  site?: typeof SITE
  headline?: string
  body?: string
  subheadline?: string
  imageUrl?: string
  trustItems?: string[]
  decorativeAsset?: string
  /** A per-service CTA (the service-detail route passes serviceCta(slug)); absent → the site-wide one. */
  cta?: { href: string; label: string }
}) {
  const cta = ctaOverride ?? primaryCta()
  const place = [site.address?.city, site.address?.state].filter(Boolean).join(', ')
  return (
    <section className="bg-[var(--fam-surface,#fff)]">
      <div className="container-x py-12 md:py-16">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            {place && (
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--fam-accent,var(--color-brand-600))]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--fam-accent,var(--color-brand-600))]" />
                {place}
              </span>
            )}
            <h1 className="mt-4 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-[var(--fam-ink,var(--color-ink-900))] sm:text-4xl md:text-5xl">
              {headline}
            </h1>
            {body && (
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--fam-ink-muted,var(--color-ink-500))]">
                {body}
              </p>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <PrimaryCta to={ctaOverride ? cta.href : undefined} className="btn btn-lg btn-primary">
                {cta.label} <ArrowRight className="h-4 w-4" />
              </PrimaryCta>
              <a
                href={`tel:${site.phone}`}
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-[var(--fam-hairline,var(--color-ink-100,#e5e7eb))] px-5 font-semibold text-[var(--fam-ink,var(--color-ink-900))] transition-colors hover:border-[var(--fam-accent,var(--color-brand-600))]"
              >
                <Phone className="h-4 w-4 text-[var(--fam-accent,var(--color-brand-600))]" /> {site.phoneDisplay}
              </a>
            </div>
            {trustItems && trustItems.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--fam-ink-muted,var(--color-ink-500))]">
                {trustItems.map((t) => (
                  <span key={t} className="inline-flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[var(--fam-accent,var(--color-brand-600))]" /> {t}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-[var(--fam-hairline,var(--color-ink-100,#e5e7eb))]">
              <img src={imageSrc(imageUrl)} alt={HERO_ALT} loading="eager" className="aspect-[4/3] w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
