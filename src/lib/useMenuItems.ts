import { useEffect, useState } from 'react'
import { BUSINESS_ID, SUPABASE_ANON_KEY, SUPABASE_URL } from '~/data/site'
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
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`
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
