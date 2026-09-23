import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Loader2 } from 'lucide-react'
import { tr } from '~/lib/i18n'
import { imageSrc } from '~/lib/asset-url'
import { useProducts, type Product } from '~/lib/useProducts'
import { BUSINESS_ID, SUPABASE_ANON_KEY, SUPABASE_URL } from '~/data/site'

// Product grid LAYOUT: 'cards' (niche arc Stage 4) — a read-only catalogue: photo, name, price (with the
// compare-at struck through when the owner set one), a stock note, and ONE action: the owner's payment link
// when enabled ("Buy"), else "Ask about this" to the contact form. No cart, no checkout — that is the
// ecommerce arc; a grid that leads to "Order" on the contact form is honest today.
//
// LIVE-READ on the booking-widget model (useProducts): SSR from SITE.products (baked from the products table
// at build), the client reconciles live. Returns null with no products. Text = block params
// (label/heading/body). Nothing here is invented: no price → "Ask", no photo → a plain tile.
//
// ★★★ BUY GOES THROUGH THE BUSINESS'S OWN CARD DOOR (part 4, 2026-09-23): a priced product shows Buy; it asks the person's name, email
// and phone, then opens a Stripe Checkout on the business's own account (product-checkout). Paid, the sale lands as an invoice with the
// payment on it and the person comes back here to "Paid. Thank you." No owner-pasted links, ever (the owner, 2026-09-23). A business
// with no card payments says so plainly and points to the front desk.
// TOKEN DISCIPLINE: fam-* surfaces/ink/hairline, bg-cta for the buy action, rounded-* (DNA), font-display.
const HEADERS = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
export function ProductGridBlock({
  label,
  heading,
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const products = useProducts()
  const [open, setOpen] = useState<Product | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [paid, setPaid] = useState<{ first_name: string | null; product: string | null; invoice: string | null; landed: boolean } | null>(null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const q = new URLSearchParams(window.location.search)
    const sid = q.get('session_id') || ''
    if (q.get('bought') !== '1' || !/^cs_(live|test)_[A-Za-z0-9]+$/.test(sid) || !SUPABASE_URL || !BUSINESS_ID) return
    let tries = 0
    const read = async () => {
      try {
        const r = await fetch(`${SUPABASE_URL}/functions/v1/product-checkout?session=${encodeURIComponent(sid)}&business=${BUSINESS_ID}`, { headers: HEADERS })
        const j = (await r.json()) as { paid?: boolean; landed?: boolean; first_name?: string | null; product?: string | null; invoice?: string | null }
        if (j.paid) setPaid({ first_name: j.first_name ?? null, product: j.product ?? null, invoice: j.invoice ?? null, landed: !!j.landed })
        if (j.paid && !j.landed && tries++ < 6) setTimeout(read, 2500)
      } catch { /* the page stays as it is */ }
    }
    void read()
  }, [])
  if (products.length === 0 && !paid) return null
  const buy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!open) return
    setBusy(true); setNote(null)
    try {
      const back = `${window.location.origin}${window.location.pathname}`
      const res = await fetch(`${SUPABASE_URL}/functions/v1/product-checkout`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...HEADERS },
        body: JSON.stringify({ businessId: BUSINESS_ID, productId: open.id, qty: 1, customer: { firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), phone: form.phone.trim() }, returnUrl: `${back}?bought=1`, cancelUrl: back }),
      })
      const data = (await res.json().catch(() => ({}))) as { available?: boolean; url?: string; message?: string }
      if (data.available && data.url) { window.location.href = data.url; return }
      setNote(data.message || tr('products.notOnline'))
    } catch { setNote(tr('products.notOnline')) } finally { setBusy(false) }
  }
  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label ?? tr('products.eyebrow')}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading ?? tr('products.heading')}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>

        {paid && (
          <div data-product-paid role="status" className="mt-8 rounded-2xl border border-fam-hairline bg-fam-surface px-5 py-4 text-fam-ink">
            <div className="font-display text-lg font-semibold">{tr('products.paidTitle')}</div>
            <p className="mt-1 text-sm text-fam-ink-muted">{(paid.first_name ? `${paid.first_name}, ` : '') + tr('products.paidBody').replace('{product}', paid.product ?? '')}{paid.invoice ? ` ${tr('products.paidInvoice').replace('{invoice}', paid.invoice)}` : ''}{!paid.landed ? ` ${tr('products.paidLanding')}` : ''}</p>
          </div>
        )}
        {open && (
          <form onSubmit={buy} data-product-buy-form className="mt-8 max-w-md rounded-2xl border border-fam-hairline bg-fam-surface p-5">
            <div className="font-display text-lg font-semibold text-fam-ink">{tr('products.buying').replace('{product}', open.name)}{open.price ? ` · ${open.price}` : ''}</div>
            <p className="mt-1 text-sm text-fam-ink-muted">{tr('products.details')}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder={tr('form.firstName')} aria-label={tr('form.firstName')} className="h-11 rounded-xl border border-fam-hairline bg-fam-card px-3 text-sm text-fam-ink" />
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder={tr('form.lastName')} aria-label={tr('form.lastName')} className="h-11 rounded-xl border border-fam-hairline bg-fam-card px-3 text-sm text-fam-ink" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={tr('form.email')} aria-label={tr('form.email')} className="h-11 rounded-xl border border-fam-hairline bg-fam-card px-3 text-sm text-fam-ink" />
              <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={tr('form.phone')} aria-label={tr('form.phone')} className="h-11 rounded-xl border border-fam-hairline bg-fam-card px-3 text-sm text-fam-ink" />
            </div>
            {note && <p role="alert" className="mt-3 text-sm text-fam-ink-muted" data-product-note>{note}</p>}
            <div className="mt-4 flex items-center gap-3">
              <button type="submit" disabled={busy} className="inline-flex h-11 items-center gap-2 rounded-xl bg-cta px-5 text-sm font-semibold text-cta-foreground disabled:opacity-60">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{tr('products.payNow')}</button>
              <button type="button" onClick={() => setOpen(null)} className="text-sm text-fam-ink-muted">{tr('booking.back')}</button>
            </div>
          </form>
        )}
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <li key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-fam-hairline bg-fam-card transition-shadow hover:elev-2">
              <div className="relative aspect-square bg-fam-surface-2">
                {p.image ? (
                  <img src={imageSrc(p.image)} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div aria-hidden="true" className="flex h-full w-full items-center justify-center font-display text-5xl font-semibold text-fam-ink-faint">
                    {p.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                {p.stock === 'out' && (
                  <span className="absolute left-3 top-3 rounded-full bg-fam-ink-panel px-3 py-1 text-xs font-semibold text-fam-on-dark">{tr('products.soldOut')}</span>
                )}
                {p.stock === 'low' && (
                  <span className="absolute left-3 top-3 rounded-full bg-fam-accent-soft px-3 py-1 text-xs font-semibold text-fam-accent-text-strong">{tr('products.lowStock')}</span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-semibold leading-snug text-fam-ink">{p.name}</h3>
                {p.description && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-fam-ink-muted">{p.description}</p>}
                <div className="mt-4 flex items-baseline gap-2">
                  {p.price ? (
                    <span className="font-display text-xl font-semibold tabular-nums text-fam-ink">{p.price}</span>
                  ) : (
                    <span className="text-sm text-fam-ink-muted">{tr('products.askPrice')}</span>
                  )}
                  {p.price && p.compareAtPrice && <span className="text-sm tabular-nums text-fam-ink-faint line-through">{p.compareAtPrice}</span>}
                </div>
                <div className="mt-auto pt-5">
                  {p.price && (p.rawPrice ?? 0) > 0 && p.stock !== 'out' ? (
                    <button
                      type="button"
                      onClick={() => { setOpen(p); setNote(null) }}
                      data-product-buy={p.id}
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-cta px-4 text-sm font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)"
                    >
                      {tr('products.buy')} <ArrowUpRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      to="/contact"
                      className="inline-flex h-10 items-center rounded-xl border border-fam-hairline px-4 text-sm font-semibold text-fam-ink transition-colors hover:border-fam-accent hover:text-fam-accent-text-strong"
                    >
                      {tr('products.ask')}
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
