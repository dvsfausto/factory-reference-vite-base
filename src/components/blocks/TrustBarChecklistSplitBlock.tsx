import { tr } from '~/lib/i18n'
import { Kicker, EditorialHeading, Rule } from '~/components/editorial/Primitives'
import { SITE } from '~/data/site'

// TRUST BAR VARIANT: 'checklist-split' (the Editorial theme, ZB-147 W1.2). On the beige band, two columns:
// left a kicker and a split serif heading (the block's label / heading params, else the theme's own line),
// right the real trust items as a hairline-divided checklist, a check glyph before each title and the
// description under it when the item has one.
//
// HONESTY: renders ONLY the real trust items, same resolve chain as the default
// (items ?? SITE.trustItems ?? none). No icons invented, no numbers made up. Empty items -> null.
const DEFAULT_TRUST_ITEMS: { title: string; description: string; kind?: string | null }[] = []

export function TrustBarChecklistSplitBlock({
  site = SITE,
  items,
  label,
  heading,
}: {
  site?: typeof SITE
  items?: { title: string; description: string; kind?: string | null }[]
  label?: string
  heading?: string
}) {
  const resolved = (
    items ??
    (site as { trustItems?: { title: string; description: string; kind?: string | null }[] }).trustItems ??
    DEFAULT_TRUST_ITEMS
  ).slice(0, 6)
  if (resolved.length === 0) return null
  return (
    <section className="bg-fam-surface-2">
      <div className="container-x py-section">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <Kicker>{label ?? tr('editorial.checklistKicker')}</Kicker>
            <EditorialHeading text={heading ?? tr('editorial.checklistHeading')} size="md" className="mt-6" />
          </div>
          <ul className="list-none p-0 m-0 md:col-span-7">
            {resolved.map((item, i) => (
              <li key={`${item.title}-${i}`}>
                {i === 0 && <Rule />}
                <div className="flex items-start gap-4 py-5">
                  <span aria-hidden="true" className="mt-px shrink-0 font-sans text-[15px] leading-relaxed text-fam-ink">✓</span>
                  <div className="min-w-0">
                    <p className="font-sans text-[15px] leading-relaxed text-fam-ink">{item.title}</p>
                    {item.description && <p className="mt-1 font-sans text-[13px] leading-relaxed text-fam-ink-muted">{item.description}</p>}
                  </div>
                </div>
                <Rule />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
