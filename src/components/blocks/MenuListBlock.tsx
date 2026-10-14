import { tr } from '~/lib/i18n'
import { useMenu, type LiveMenu, type LiveMenuItem, type MenuGroup } from '~/lib/useMenuItems'

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
//
// ZB-275 (2026-10-14): a business with menu rows shows ITS menu (useMenu → menu_public): menus, sections, items with
// sizes, add-ons, tags, a sold-out mark and "from 5:00 PM" for an item served later today. Allergens and dietary marks
// come only from the stored tags. No menu rows → the services list below, exactly as before.
export function MenuListBlock({
  label,
  heading,
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const view = useMenu()
  if (view.mode === 'menu') return <RestaurantMenu menus={view.menus} label={label} heading={heading} body={body} />
  return <ServicesMenu groups={view.groups} label={label} heading={heading} body={body} />
}

function ServicesMenu({ groups, label, heading, body }: { groups: MenuGroup[]; label?: string; heading?: string; body?: string }) {
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

const tagLabel = (t: string) => tr(`menu.tag.${t}` as Parameters<typeof tr>[0])
const allergenLabel = (a: string) => tr(`menu.allergen.${a}` as Parameters<typeof tr>[0])

function MenuItemRow({ it }: { it: LiveMenuItem }) {
  const priceLine = it.sizes.length ? '' : it.price || it.priceNote
  return (
    <li data-menu-item={it.id} className={it.soldOut ? 'flex gap-4 opacity-60' : 'flex gap-4'}>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <span data-menu-field="name" className="font-display text-lg font-semibold text-fam-ink">
            {it.name}
          </span>
          <span aria-hidden="true" className="min-w-6 flex-1 border-b border-dotted border-fam-hairline" />
          {priceLine && (
            <span data-menu-field="price" className="shrink-0 font-display text-lg font-semibold tabular-nums text-fam-ink">
              {priceLine}
            </span>
          )}
        </div>
        {(it.soldOut || it.availableFrom) && (
          <div className="mt-1 flex flex-wrap gap-2">
            {it.soldOut && <span className="rounded-full bg-fam-ink px-2.5 py-0.5 text-xs font-semibold text-fam-surface">{tr('menu.soldOut')}</span>}
            {!it.soldOut && it.availableFrom && (
              <span className="rounded-full bg-fam-accent-soft px-2.5 py-0.5 text-xs font-semibold text-fam-accent-text-strong">{tr('menu.from').replace('{time}', it.availableFrom)}</span>
            )}
          </div>
        )}
        {it.description && (
          <p data-menu-field="description" className="mt-1 max-w-prose text-sm leading-relaxed text-fam-ink-muted">
            {it.description}
          </p>
        )}
        {it.sizes.length > 0 && (
          <p data-menu-field="price" className="mt-1.5 text-sm font-medium tabular-nums text-fam-ink">
            {it.sizes.map((z, i) => (
              <span key={z.id}>
                {i > 0 && <span aria-hidden="true" className="px-1.5 text-fam-ink-muted">·</span>}
                {z.name}
                {z.price && <span className="ml-1">{z.price}</span>}
              </span>
            ))}
          </p>
        )}
        {it.addOns.map((g) => (
          <p key={g.id} className="mt-1 text-sm text-fam-ink-muted">
            <span className="font-medium text-fam-ink">{g.name}</span>
            {g.required && <span> ({tr('menu.required')})</span>}
            {': '}
            {g.options.map((o) => (o.delta ? `${o.name} ${o.delta}` : o.name)).join(', ')}
          </p>
        ))}
        {(it.dietary.length > 0 || it.allergens.length > 0) && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {it.dietary.map((t) => (
              <span key={t} className="rounded-full border border-fam-hairline px-2 py-0.5 text-xs font-medium text-fam-ink">
                {tagLabel(t)}
              </span>
            ))}
            {it.allergens.length > 0 && (
              <span className="text-xs text-fam-ink-muted">{tr('menu.contains').replace('{list}', it.allergens.map(allergenLabel).join(', '))}</span>
            )}
          </div>
        )}
      </div>
      {it.photo && (
        <img
          data-menu-field="photo"
          src={it.photo}
          alt={it.name}
          loading="lazy"
          className="h-20 w-20 shrink-0 rounded-lg object-cover sm:h-24 sm:w-24"
        />
      )}
    </li>
  )
}

function RestaurantMenu({ menus, label, heading, body }: { menus: LiveMenu[]; label?: string; heading?: string; body?: string }) {
  const count = menus.reduce((n, m) => n + m.sections.reduce((k, s) => k + s.items.length, 0), 0)
  if (count === 0) return null
  const named = menus.length > 1
  return (
    <section className="bg-fam-surface" data-menu-source="menu">
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
        {menus.map((m) => (
          <div key={m.id} data-menu={m.id} className="mt-12">
            {named && <h3 className="font-display text-2xl font-semibold tracking-tight text-fam-ink sm:text-3xl">{m.name}</h3>}
            {m.note && <p className={named ? 'mt-2 max-w-prose text-fam-ink-muted' : 'max-w-prose text-fam-ink-muted'}>{m.note}</p>}
            <div className={`${named || m.note ? 'mt-8 ' : ''}grid gap-x-16 gap-y-12 ${m.sections.length > 1 ? 'lg:grid-cols-2' : 'max-w-2xl'}`}>
              {m.sections.map((s) => (
                <div key={s.id} data-menu-section={s.id}>
                  <h4 className="font-display text-xl font-semibold tracking-tight text-fam-ink">
                    <span className="border-b-2 border-fam-accent pb-1">{s.name}</span>
                  </h4>
                  {s.description && <p className="mt-4 max-w-prose text-sm text-fam-ink-muted">{s.description}</p>}
                  <ul className="mt-6 space-y-6">
                    {s.items.map((it) => (
                      <MenuItemRow key={it.id} it={it} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
