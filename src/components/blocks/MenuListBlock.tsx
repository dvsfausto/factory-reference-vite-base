import { tr } from '~/lib/i18n'
import { useMenuItems } from '~/lib/useMenuItems'

// Menu LAYOUT: 'list' (niche arc Stage 4) — categories as headings, each item a row with a dotted leader
// to its price, the description under the name. A LIVE-READ block on the booking-widget model
// (useMenuItems): the items are the catalogue's services, edited through the existing catalogue tools,
// and survive a rebuild by construction (nothing is persisted here). Returns null with no items.
//
// Text = block params (label/heading/body — the editor's durable text channel); prices and item text are
// the owner's rows and are never fabricated (no price → no price shown; no items → no section).
//
// TOKEN DISCIPLINE: fam-ink / fam-ink-muted / fam-hairline / fam-accent-* (DNA), rounded-* (DNA),
// font-display (DNA), the section on the family surface. No literal colours.
export function MenuListBlock({
  label,
  heading,
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const groups = useMenuItems()
  const count = groups.reduce((n, g) => n + g.items.length, 0)
  if (count === 0) return null
  const flat = groups.length === 1 && groups[0]!.name === ''
  return (
    <section className="bg-fam-surface">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label ?? tr('menu.eyebrow')}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading ?? tr('menu.heading')}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>

        <div className={flat ? 'mt-12 grid gap-x-16 gap-y-10 lg:grid-cols-2' : 'mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-2'}>
          {groups.map((g) => (
            <div key={g.name || '_'} className={flat ? 'contents' : ''}>
              {g.name && (
                <h3 className="font-display text-xl font-semibold tracking-tight text-fam-ink">
                  <span className="border-b-2 border-fam-accent pb-1">{g.name}</span>
                </h3>
              )}
              <ul className={g.name ? 'mt-6 space-y-5' : 'contents'}>
                {g.items.map((it) => (
                  <li key={it.id} className={flat ? 'space-y-5' : ''}>
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-lg font-semibold text-fam-ink">{it.name}</span>
                      <span aria-hidden="true" className="min-w-6 flex-1 border-b border-dotted border-fam-hairline" />
                      {it.price && <span className="font-display text-lg font-semibold tabular-nums text-fam-ink">{it.price}</span>}
                    </div>
                    {it.description && <p className="mt-1 max-w-prose text-sm leading-relaxed text-fam-ink-muted">{it.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
