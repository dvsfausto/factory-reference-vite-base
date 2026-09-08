import { useEffect, useState } from 'react'
import { BUSINESS_ID, SITE, SUPABASE_ANON_KEY, SUPABASE_URL } from '~/data/site'

// THE PRODUCTS READ (niche arc Stage 4) — the booking-widget model over the products table (the dashboard's
// own CRUD; RLS "Public can view active products" gates the read). SSR / first paint = SITE.products, baked
// by the scaffolder from the same table at build time (names, prices, photos in the HTML). The client then
// reconciles LIVE (when SITE.productsLive is set) so a product added, repriced or sold out after the build shows
// with no rebuild; a failed or empty read keeps the baked list. Nothing to persist for the editor: a rebuild
// re-reads the table.
export interface Product {
  id: string
  name: string
  description: string
  /** '$14' style, or '' when unpriced (the card says "Ask"). */
  price: string
  compareAtPrice: string
  image: string
  stock: '' | 'low' | 'out'
  /** The owner's payment link when enabled; '' → the contact form. */
  buyUrl: string
}

export function readBakedProducts(site: typeof SITE = SITE): Product[] {
  const list = (site as { products?: Product[] }).products
  return Array.isArray(list) ? list : []
}

// Mirrors factory-build/factory/scaffolder/src/lib/products.ts (productsFromRows): the same rules, so a
// live row and a baked row present identically.
function money(v: number | string | null | undefined): string {
  if (v === null || v === undefined || v === '') return ''
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(n) || n <= 0) return ''
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`
}
function firstImage(r: { photo_url?: string | null; images?: unknown }): string {
  if (typeof r.photo_url === 'string' && r.photo_url.trim()) return r.photo_url.trim()
  if (Array.isArray(r.images)) {
    const s = r.images.find((x) => typeof x === 'string' && x.trim()) as string | undefined
    if (s) return s.trim()
    const o = r.images.find((x) => x && typeof x === 'object' && typeof (x as { url?: unknown }).url === 'string') as { url: string } | undefined
    if (o) return o.url.trim()
  }
  return ''
}

/** The client re-read runs only when the build says so (SITE.productsLive — the PRODUCTS_LIVE_READ flag): the
 *  products table's anon read needs the RLS fix (migration 20260908130000) first, and a 401 on every page is
 *  worse than a list that refreshes on rebuild. */
export function productsLiveRead(site: typeof SITE = SITE): boolean {
  return (site as { productsLive?: boolean }).productsLive === true
}

export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(readBakedProducts)
  useEffect(() => {
    if (!productsLiveRead()) return
    let cancelled = false
    const url =
      `${SUPABASE_URL}/rest/v1/products?business_id=eq.${BUSINESS_ID}&is_active=eq.true` +
      `&select=id,name,description,price,compare_at_price,photo_url,images,stock_status,payment_link_enabled,payment_link_url,sort_order&order=sort_order.asc`
    fetch(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rows: Array<Record<string, unknown>>) => {
        if (cancelled || !Array.isArray(rows) || rows.length === 0) return
        setProducts(
          rows
            .filter((r) => typeof r.name === 'string' && (r.name as string).trim())
            .map<Product>((r) => ({
              id: String(r.id),
              name: (r.name as string).trim(),
              description: typeof r.description === 'string' ? r.description.trim() : '',
              price: money(r.price as number | string | null),
              compareAtPrice: money(r.compare_at_price as number | string | null),
              image: firstImage(r as { photo_url?: string | null; images?: unknown }),
              stock: r.stock_status === 'out_of_stock' ? 'out' : r.stock_status === 'low_stock' ? 'low' : '',
              buyUrl: r.payment_link_enabled && typeof r.payment_link_url === 'string' && /^https?:\/\//.test(r.payment_link_url) ? r.payment_link_url : '',
            })),
        )
      })
      .catch(() => {
        /* keep baked — degrade-safe */
      })
    return () => {
      cancelled = true
    }
  }, [])
  return products
}
