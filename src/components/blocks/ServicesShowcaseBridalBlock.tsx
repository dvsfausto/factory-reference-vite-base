import { Link } from '@tanstack/react-router'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl, serviceImageFocusStyle } from '~/data/images'
import { hasServicePhoto } from '~/lib/service-photo'
import { hasText } from '~/lib/has-text'
import { GoldHeading, Chip, Diamond, CAPS } from '~/components/showcase/Primitives'

// servicesPreview VARIANT: 'showcase-bridal' (the Showcase theme, 2026-10-29). Anchored at #bridal. A gold chip
// (params.eyebrow), a big uppercase headline (params.heading, the gold-word rule), one short line (params.body), then the
// FIRST TWO services as two large tiles, each the service photo framed by a hairline, its name in spaced capitals and a small
// gold line (params.subtitle, else "Custom · One of One"), linking to the service page. Under them up to three small points
// from SITE.trustItems (title and short text, a gold diamond); none, no points. No services: nothing.
export function ServicesShowcaseBridalBlock({
  services = SERVICES,
  heading,
  body,
  eyebrow,
  subtitle,
}: {
  services?: typeof SERVICES
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  exploreLabel?: string
  moreLink?: string
  eyebrow?: string
  subtitle?: string
}) {
  const tiles = services.slice(0, 2)
  if (tiles.length === 0) return null
  const points = ((SITE as { trustItems?: Array<{ title?: string; description?: string }> }).trustItems ?? []).filter((t) => hasText(t.title)).slice(0, 3)
  // the gold line under a tile only when the owner wrote one (no default claim on a stock photo, Fausto 2026-10-29)
  const line = hasText(subtitle) ? subtitle! : ''
  return (
    <section id="bridal" className="scroll-mt-32 bg-fam-page" data-showcase="bridal">
      <div className="container-x py-section">
        <div className="flex flex-col items-center text-center">
          {hasText(eyebrow) && <Chip>{eyebrow}</Chip>}
          {hasText(heading) && <GoldHeading text={heading!} className={`text-4xl sm:text-5xl lg:text-[64px] ${hasText(eyebrow) ? 'mt-8' : ''}`} />}
          {hasText(body) && <p className="mt-6 max-w-lg font-sans text-[15px] leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        <ul className={`m-0 mt-14 grid list-none grid-cols-1 gap-8 p-0 md:mt-20 ${tiles.length === 2 ? 'md:grid-cols-2' : 'md:mx-auto md:max-w-xl'}`}>
          {tiles.map((s) => (
            <li key={s.slug}>
              <Link to="/services/$slug" params={{ slug: s.slug }} className="group block focus-ring">
                <div className="aspect-[4/5] overflow-hidden border border-fam-hairline bg-fam-surface-2 sm:aspect-[5/6]">
                  {hasServicePhoto(s.slug) && (
                    <img src={serviceImageUrl(s.slug)} alt={s.name} loading="lazy" style={serviceImageFocusStyle(s.slug)} className="h-full w-full object-cover transition-transform duration-(--motion-slower) group-hover:scale-(--hov-zoom)" />
                  )}
                </div>
                <div className="mt-6 text-center">
                  <h3 className={`${CAPS} text-[13px] text-fam-ink`}>{s.displayName}</h3>
                  {hasText(line) && <p className={`mt-2 ${CAPS} text-[10px] text-fam-accent-text`}>{line}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {points.length > 0 && (
          <ul className="m-0 mt-16 grid list-none grid-cols-1 gap-10 border-t border-fam-hairline p-0 pt-12 sm:grid-cols-3 md:mt-20">
            {points.map((p, i) => (
              <li key={i} className="flex flex-col items-center text-center">
                <Diamond className="h-2 w-2" />
                <p className={`mt-4 ${CAPS} text-fam-ink`}>{p.title}</p>
                {hasText(p.description) && <p className="mt-2 max-w-[16rem] font-sans text-[13px] leading-relaxed text-fam-ink-muted line-clamp-2">{p.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
