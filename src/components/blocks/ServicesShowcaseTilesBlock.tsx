import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { SERVICES } from '~/data/services-view'
import { serviceImageUrl, serviceImageFocusStyle } from '~/data/images'
import { hasServicePhoto } from '~/lib/service-photo'
import { hasText } from '~/lib/has-text'

// ServicesPreview LAYOUT: 'showcase-tiles' (the Showcase theme, 2026-10-29). The first three services as LARGE tall
// tiles (4:5), each the photo, the service name as a short label under it and one small "View" link to its page. No
// descriptions, no prices, no numbering. A heading only when the block's params give one. The section carries the
// anchor id "collections" so a menu link /#collections lands on it. Every colour a fam-* token. A service without a
// photo keeps its tile as a quiet ground with the name (no broken frame). Zero services: nothing.
export function ServicesShowcaseTilesBlock({
  services = SERVICES,
  heading,
}: {
  services?: typeof SERVICES
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  exploreLabel?: string
  moreLink?: string
}) {
  const tiles = services.slice(0, 3)
  if (tiles.length === 0) return null
  const cols = tiles.length === 1 ? 'md:max-w-xl md:mx-auto' : tiles.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
  return (
    <section id="collections" className="scroll-mt-24 bg-fam-page">
      <div className="container-x py-section">
        {hasText(heading) && (
          <h2 className="mb-12 text-center font-display text-3xl font-normal tracking-[-0.01em] text-fam-ink md:mb-16 md:text-5xl">{heading}</h2>
        )}
        <ul className={`m-0 grid list-none grid-cols-1 gap-x-6 gap-y-14 p-0 lg:gap-x-10 ${cols}`}>
          {tiles.map((s) => (
            <li key={s.slug}>
              <Link to="/services/$slug" params={{ slug: s.slug }} className="group block focus-ring">
                <div className="aspect-[4/5] overflow-hidden bg-fam-surface-2">
                  {hasServicePhoto(s.slug) && (
                    <img
                      src={serviceImageUrl(s.slug)}
                      alt={s.name}
                      loading="lazy"
                      style={serviceImageFocusStyle(s.slug)}
                      className="h-full w-full object-cover transition-transform duration-(--motion-slower) group-hover:scale-(--hov-zoom)"
                    />
                  )}
                </div>
                <div className="mt-6 flex flex-col items-center gap-3 text-center">
                  <h3 className="font-display text-2xl font-normal tracking-[-0.01em] text-fam-ink md:text-[28px]">{s.displayName}</h3>
                  <span className="border-b border-fam-accent pb-1 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-fam-ink">
                    {tr('showcase.view')}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
