import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { ARROW } from '~/lib/editorial'
import { Kicker, Numeral, Rule, EditorialButton } from '~/components/editorial/Primitives'
import { SERVICES } from '~/data/services-view'

// ServicesPreview LAYOUT: 'numbered-list' (the Editorial theme, ZB-147 W1.2). A kicker, a rule, then one row
// per service: numeral / serif name over a one-line blurb / arrow. The whole row is the link; hovering it
// underlines the name. No photos, no cards: the type and the hairlines carry it. Character-agnostic, every
// colour a fam-* token, so it also reads well on a site without the theme.
//
// Same service list, links and cap as the 'list' layout (ServicesListBlock, 8 rows); a "view all" arrow link
// follows when the business has more. Prop signature identical to ServicesPreviewBlock; returns Element | null.
export function ServicesNumberedListBlock({
  services = SERVICES,
  label,
  moreLink,
}: {
  services?: typeof SERVICES
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  exploreLabel?: string
  moreLink?: string
}) {
  const rows = services.slice(0, 8)
  if (rows.length === 0) return null
  return (
    <section className="bg-fam-page">
      <div className="container-x py-section">
        <Kicker>{label ?? tr('editorial.exploreKicker')}</Kicker>
        <Rule className="mt-6" />
        <ol className="list-none p-0 m-0">
          {rows.map((s, i) => (
            <li key={s.slug}>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group grid grid-cols-[44px_1fr_auto] items-start gap-x-4 pt-9 pb-8 md:grid-cols-[80px_1fr_auto] md:gap-x-6"
              >
                <Numeral n={i + 1} className="pt-3" />
                <div className="min-w-0">
                  <h3 className="font-display font-normal leading-[1.05] tracking-[-0.01em] text-fam-ink text-[36px] md:text-[40px] underline-offset-[6px] decoration-1 group-hover:underline">
                    {s.displayName}
                  </h3>
                  <p className="mt-3 font-sans text-[15px] leading-relaxed text-fam-ink-muted line-clamp-1">{s.short}</p>
                </div>
                <span aria-hidden="true" className="pt-3 font-sans text-[18px] leading-none text-fam-ink">
                  {ARROW}
                </span>
              </Link>
              <Rule />
            </li>
          ))}
        </ol>
        {services.length > rows.length && (
          <div className="mt-10">
            <EditorialButton href="/services" tone="link">{moreLink ?? tr('common.allServices')}</EditorialButton>
          </div>
        )}
      </div>
    </section>
  )
}
