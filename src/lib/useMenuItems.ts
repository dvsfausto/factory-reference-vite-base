import { moneyShort, SITE_CURRENCY } from '~/lib/money'
import { useEffect, useState } from 'react'
import { BUSINESS_ID, SITE, SUPABASE_ANON_KEY, SUPABASE_URL } from '~/data/site'
import { LANG } from '~/lib/i18n'
import { SERVICES } from '~/data/services-view'

// THE MENU READ (niche arc Stage 4) — the booking-widget model over the services rows: a restaurant's
// "services" are its dishes, a bakery's its cakes, and the owner already edits them through the
// catalogue (crm_update_service / the dashboard). No new table, no new intake field, nothing to
// persist for the editor: a rebuild cannot lose a menu item because the menu is never baked as data.
//
//   · SSR / first paint = the BAKED services (names + short lines from services.ts → in the HTML for SEO).
//     Prices and categories are NOT baked (the intake carries none for the menu) — they arrive live.
//   · Client reconciles with a LIVE read (id, name, description, price, display_order, metadata.category):
//     a dish the owner adds after the build shows with no rebuild; a price change shows with no rebuild.
//   · Fetch failure or an empty read → the baked list (never an empty menu on a site that has services).
//
// Categories come from services.metadata.category (the seed writes slugs like 'deep' / 'move_in_out';
// humanised here). Items without one sit in a single unnamed group; when NO item has a category the
// whole menu is one flat list.
export interface MenuItem {
  id: string
  name: string
  description: string
  /** '$12' style, or '' when the row has no price (quote-only / unpriced). */
  price: string
}
export interface MenuGroup {
  /** '' for the unnamed group. */
  name: string
  items: MenuItem[]
}

export function humaniseCategory(slug: string): string {
  const t = slug.replace(/[_-]+/g, ' ').trim()
  return t ? t[0]!.toUpperCase() + t.slice(1) : ''
}

export function formatMenuPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined || price === '') return ''
  const n = typeof price === 'number' ? price : Number(price)
  if (!Number.isFinite(n) || n <= 0) return ''
  return moneyShort(n)
}

export function groupMenu(rows: Array<MenuItem & { category?: string | null; order?: number | null }>): MenuGroup[] {
  const sorted = [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const byCat = new Map<string, MenuItem[]>()
  for (const r of sorted) {
    const cat = humaniseCategory(r.category ?? '')
    const list = byCat.get(cat) ?? []
    list.push({ id: r.id, name: r.name, description: r.description, price: r.price })
    byCat.set(cat, list)
  }
  // Named groups in first-seen order; the unnamed group last.
  const groups = [...byCat.entries()].map(([name, items]) => ({ name, items }))
  return groups.sort((a, b) => (a.name === '' ? 1 : 0) - (b.name === '' ? 1 : 0))
}

function baked(): MenuGroup[] {
  const items = SERVICES.map<MenuItem>((s) => ({ id: s.id, name: s.name, description: s.short, price: '' }))
  return items.length ? [{ name: '', items }] : []
}

export function useMenuItems(): MenuGroup[] {
  const [groups, setGroups] = useState<MenuGroup[]>(baked)
  useEffect(() => {
    let cancelled = false
    const url =
      `${SUPABASE_URL}/rest/v1/services?business_id=eq.${BUSINESS_ID}` +
      `&is_active=eq.true&select=id,name,description,price,display_order,metadata&order=display_order.asc`
    fetch(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rows: Array<{ id: string; name: string; description: string | null; price: number | string | null; display_order: number | null; metadata: { category?: string } | null }>) => {
        if (cancelled || !Array.isArray(rows) || rows.length === 0) return
        setGroups(
          groupMenu(
            rows.map((r) => ({
              id: r.id,
              name: r.name,
              description: r.description ?? '',
              price: formatMenuPrice(r.price),
              category: r.metadata?.category ?? null,
              order: r.display_order,
            })),
          ),
        )
      })
      .catch(() => {
        /* keep baked — degrade-safe */
      })
    return () => {
      cancelled = true
    }
  }, [])
  return groups
}

// ── THE RESTAURANT MENU (ZB-275, 2026-10-14) ───────────────────────────────────────────────────────────────────────────
// A business with rows in the menu tables gets ITS menu: the block reads menu_public live (active menus, sections and
// items served now or later today, in the business currency, with sizes, add-ons, tags and a sold-out flag). The
// factory bakes names only (SITE.menu) for the first paint; prices, tags and sold out arrive live. A business with NO
// menu rows reads exactly what it read before (the services read above), so its menu block does not change.
export interface LiveMenuSize { id: string; name: string; price: string }
export interface LiveMenuAddOn { id: string; name: string; delta: string }
export interface LiveMenuAddOnGroup { id: string; name: string; required: boolean; options: LiveMenuAddOn[] }
export interface LiveMenuItem {
  id: string
  name: string
  description: string
  /** '$12' in the business currency, '' when the row has no price. */
  price: string
  /** the owner's own words when there is no price ("market price"). */
  priceNote: string
  /** an owner photo only (the table refuses any other source); '' = none. */
  photo: string
  dietary: string[]
  allergens: string[]
  soldOut: boolean
  /** '' = served now; otherwise the local time it starts today ("5:00 PM"). */
  availableFrom: string
  sizes: LiveMenuSize[]
  addOns: LiveMenuAddOnGroup[]
}
export interface LiveMenuSection { id: string; name: string; description: string; items: LiveMenuItem[] }
export interface LiveMenu { id: string; name: string; note: string; sections: LiveMenuSection[] }
export type MenuView = { mode: 'menu'; menus: LiveMenu[] } | { mode: 'services'; groups: MenuGroup[] }

/** SITE.menu (baked by the factory only when the business has menu rows): names and descriptions, no prices. */
interface BakedMenu { id: string; name: string; note?: string; sections: Array<{ id: string; name: string; description?: string; items: Array<{ id: string; name: string; description?: string }> }> }

function bakedMenu(): LiveMenu[] {
  const raw = (SITE as { menu?: BakedMenu[] }).menu
  if (!Array.isArray(raw)) return []
  return raw.map((m) => ({
    id: m.id,
    name: m.name,
    note: m.note ?? '',
    sections: m.sections.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description ?? '',
      items: s.items.map((i) => ({ id: i.id, name: i.name, description: i.description ?? '', price: '', priceNote: '', photo: '', dietary: [], allergens: [], soldOut: false, availableFrom: '', sizes: [], addOns: [] })),
    })),
  }))
}

const ownerPhoto = (u: unknown): string => (typeof u === 'string' && /^https:\/\//.test(u.trim()) ? u.trim() : '')
const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')
const strs = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [])

/** "17:00:00" → "5:00 PM" (English) / "17:00" (Spanish); '' when absent or unreadable. */
export function menuTime(t: unknown): string {
  const m = typeof t === 'string' ? /^(\d{1,2}):(\d{2})/.exec(t) : null
  if (!m) return ''
  const d = new Date(Date.UTC(2000, 0, 1, Number(m[1]), Number(m[2])))
  try {
    return new Intl.DateTimeFormat(LANG === 'es' ? 'es' : 'en-US', { hour: 'numeric', minute: '2-digit', hour12: LANG !== 'es', timeZone: 'UTC' }).format(d)
  } catch {
    return `${m[1]}:${m[2]}`
  }
}

/** A price in the row's currency (the business's, from the view); null, '' or a non-number → ''. A zero price shows (a free side is a fact). */
function menuMoney(v: unknown, currency: string): string {
  if (v === null || v === undefined || v === '') return ''
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(n) || n < 0) return ''
  return moneyShort(n, currency)
}

/** An add-on's price change: "+$2", "" when it costs nothing more. */
function deltaMoney(v: unknown, currency: string): string {
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(n) || n === 0) return ''
  return n > 0 ? `+${moneyShort(n, currency)}` : `-${moneyShort(-n, currency)}`
}

export interface MenuPublicRow {
  menu_id: string; menu_name: string; menu_note: string | null; menu_order: number | null
  section_id: string; section_name: string; section_description: string | null; section_order: number | null
  item_id: string; name: string; description: string | null; price: number | string | null; price_note: string | null; currency: string | null
  photo_url: string | null; dietary: string[] | null; allergens: string[] | null; sold_out: boolean | null; item_order: number | null
  sizes: Array<{ id: string; name: string; price: number | string }> | null
  modifier_groups: Array<{ id: string; name: string; required?: boolean; modifiers?: Array<{ id: string; name: string; price_delta: number | string }> }> | null
  /** optional (the view's later columns): null when the item is served now */
  available_from?: string | null
}

/** menu_public rows → menus → sections → items, each level in its owner's order. */
export function menuFromRows(rows: MenuPublicRow[]): LiveMenu[] {
  const ord = (n: number | null | undefined) => (typeof n === 'number' ? n : 0)
  const sorted = [...rows].sort(
    (a, b) => ord(a.menu_order) - ord(b.menu_order) || ord(a.section_order) - ord(b.section_order) || ord(a.item_order) - ord(b.item_order) || a.name.localeCompare(b.name),
  )
  const menus: LiveMenu[] = []
  for (const r of sorted) {
    if (!str(r.name)) continue
    const currency = str(r.currency).toUpperCase() || SITE_CURRENCY
    let menu = menus.find((m) => m.id === r.menu_id)
    if (!menu) menus.push((menu = { id: r.menu_id, name: str(r.menu_name), note: str(r.menu_note), sections: [] }))
    let section = menu.sections.find((s) => s.id === r.section_id)
    if (!section) menu.sections.push((section = { id: r.section_id, name: str(r.section_name), description: str(r.section_description), items: [] }))
    section.items.push({
      id: r.item_id,
      name: str(r.name),
      description: str(r.description),
      price: menuMoney(r.price, currency),
      priceNote: str(r.price_note),
      photo: ownerPhoto(r.photo_url),
      dietary: strs(r.dietary),
      allergens: strs(r.allergens),
      soldOut: r.sold_out === true,
      availableFrom: menuTime(r.available_from),
      sizes: (r.sizes ?? []).filter((z) => str(z.name)).map((z) => ({ id: z.id, name: str(z.name), price: menuMoney(z.price, currency) })),
      addOns: (r.modifier_groups ?? [])
        .map((g) => ({
          id: g.id,
          name: str(g.name),
          required: g.required === true,
          options: (g.modifiers ?? []).filter((o) => str(o.name)).map((o) => ({ id: o.id, name: str(o.name), delta: deltaMoney(o.price_delta, currency) })),
        }))
        .filter((g) => g.name && g.options.length > 0),
    })
  }
  return menus
}

function servicesRead(signal: { cancelled: boolean }, apply: (g: MenuGroup[]) => void) {
  const url =
    `${SUPABASE_URL}/rest/v1/services?business_id=eq.${BUSINESS_ID}` +
    `&is_active=eq.true&select=id,name,description,price,display_order,metadata&order=display_order.asc`
  return fetch(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((rows: Array<{ id: string; name: string; description: string | null; price: number | string | null; display_order: number | null; metadata: { category?: string } | null }>) => {
      if (signal.cancelled || !Array.isArray(rows) || rows.length === 0) return
      apply(
        groupMenu(
          rows.map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description ?? '',
            price: formatMenuPrice(r.price),
            category: r.metadata?.category ?? null,
            order: r.display_order,
          })),
        ),
      )
    })
}

/**
 * The menu block's read. menu_public first: rows → the business's menu. No rows (or the view unreachable) → the
 * services read, exactly as before ZB-275. A fetch failure keeps whatever is on screen (baked), never an empty menu.
 */
export function useMenu(): MenuView {
  const [view, setView] = useState<MenuView>(() => {
    const m = bakedMenu()
    return m.length ? { mode: 'menu', menus: m } : { mode: 'services', groups: baked() }
  })
  useEffect(() => {
    const signal = { cancelled: false }
    const url =
      `${SUPABASE_URL}/rest/v1/menu_public?business_id=eq.${BUSINESS_ID}` +
      `&select=*&order=menu_order.asc,section_order.asc,item_order.asc`
    const services = (): void => {
      servicesRead(signal, (groups) => setView({ mode: 'services', groups })).catch(() => {
        /* keep baked — degrade-safe */
      })
    }
    fetch(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rows: MenuPublicRow[]) => {
        if (signal.cancelled) return
        const menus = Array.isArray(rows) ? menuFromRows(rows) : []
        if (menus.length) setView({ mode: 'menu', menus })
        else services()
      })
      .catch(() => {
        if (!signal.cancelled) services()
      })
    return () => {
      signal.cancelled = true
    }
  }, [])
  return view
}
