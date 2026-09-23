import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { tr } from '~/lib/i18n'
import { BUSINESS_ID, SUPABASE_ANON_KEY, SUPABASE_URL } from '~/data/site'

// ★★★ THE PACKS FOR SALE ON THE SITE (the classes arc, 2026-09-23, the owner: "on the site the packs show with their price and
// a Buy that works"). A LIVE read of packs_public (the owner's `packs` rows: name, classes, price, validity; nothing else is
// public). Buy asks for the person's name, email and phone, then opens a checkout on the business's OWN Stripe (pack-checkout);
// the classes land the moment Stripe confirms, and the person comes back to /book?paid=1 to pick a class. When the business has
// not connected card payments, Buy says so plainly and points to the front desk; nothing is invented. Renders nothing when the
// business sells no packs. Sits under the class schedule, so it shows on every site that has one.
interface Pack { id: string; name: string; description: string | null; credits: number; price: number; currency: string; validity_days: number | null }
const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
const money = (n: number) => `$${Number(n).toFixed(2).replace(/\.00$/, '')}`

/* ★★★ ONE PACKS SECTION EVERYWHERE (the owner, 2026-09-23, Fitcycling: "show my packs anywhere on my site means the real packs section,
   read live, with Buy; never a page of typed words that goes stale"). The book page, the home page's Packages section and any custom page's
   Packages section all draw THIS: the live packs_public read with Buy through the business's own card door. `fallback` is what draws when
   the business has no packs on file (the baked packages block, or nothing). */
export function PacksForSale({ label, heading, body, fallback = null }: { label?: string; heading?: string; body?: string; fallback?: React.ReactNode } = {}) {
  const [packs, setPacks] = useState<Pack[] | null>(null)
  const [open, setOpen] = useState<Pack | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  useEffect(() => {
    if (!BUSINESS_ID || !SUPABASE_URL) return
    fetch(`${SUPABASE_URL}/rest/v1/packs_public?business_id=eq.${BUSINESS_ID}&select=id,name,description,credits,price,currency,validity_days&order=display_order.asc,price.asc`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Pack[]) => setPacks(Array.isArray(rows) ? rows : []))
      .catch(() => setPacks([]))
  }, [])
  if (packs === null) return null
  if (packs.length === 0) return <>{fallback}</>

  const buy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!open) return
    setBusy(true); setNote(null)
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/pack-checkout`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ businessId: BUSINESS_ID, packId: open.id, customer: { firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), phone: form.phone.trim() }, returnUrl: `${window.location.origin}/book?paid=1` }),
      })
      const data = (await res.json().catch(() => ({}))) as { available?: boolean; url?: string; message?: string }
      if (data.available && data.url) { window.location.href = data.url; return }
      setNote(data.message || tr('packs.notOnline'))
    } catch { setNote(tr('packs.notOnline')) } finally { setBusy(false) }
  }

  return (
    <div className="mt-14" data-packs-for-sale>
      {label && <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text"><span className="h-px w-6 bg-fam-accent" />{label}</span>}
      <h3 className={`font-display text-2xl font-semibold tracking-tight text-fam-ink${label ? ' mt-5' : ''}`}>{heading ?? tr('packs.heading')}</h3>
      <p className="mt-2 max-w-xl text-fam-ink-muted">{body ?? tr('packs.body')}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {packs.map((p) => (
          <div key={p.id} data-pack={p.id} className="flex flex-col rounded-2xl border border-fam-hairline bg-fam-surface p-5">
            <div className="font-display text-lg font-semibold text-fam-ink">{p.name}</div>
            <div className="mt-1 text-sm text-fam-ink-muted">{p.credits} {tr('packs.classes')}{p.validity_days ? ` · ${tr('packs.valid')} ${p.validity_days} ${tr('packs.days')}` : ''}</div>
            {p.description && <p className="mt-2 text-sm text-fam-ink-muted">{p.description}</p>}
            <div className="mt-4 flex items-center justify-between">
              <span className="font-display text-2xl font-semibold text-fam-ink">{money(p.price)}</span>
              <button type="button" onClick={() => { setOpen(p); setNote(null) }} className="rounded-full px-5 py-2 text-sm font-semibold text-fam-on-dark" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>
                {tr('packs.buy')}
              </button>
            </div>
          </div>
        ))}
      </div>
      {open && (
        <form onSubmit={(e) => void buy(e)} data-pack-buy-form className="mt-6 max-w-lg rounded-2xl border border-fam-hairline bg-fam-card p-5">
          <div className="font-display text-lg font-semibold text-fam-ink">{tr('packs.buying')} {open.name} · {money(open.price)}</div>
          <p className="mt-1 text-sm text-fam-ink-muted">{tr('packs.details')}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm"><span className="text-fam-ink-muted">{tr('form.firstName')}</span><input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="mt-1 w-full rounded-xl border border-fam-hairline bg-fam-surface px-3 py-2 text-fam-ink" /></label>
            <label className="text-sm"><span className="text-fam-ink-muted">{tr('form.lastName')}</span><input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="mt-1 w-full rounded-xl border border-fam-hairline bg-fam-surface px-3 py-2 text-fam-ink" /></label>
            <label className="text-sm"><span className="text-fam-ink-muted">{tr('form.email')}</span><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-xl border border-fam-hairline bg-fam-surface px-3 py-2 text-fam-ink" /></label>
            <label className="text-sm"><span className="text-fam-ink-muted">{tr('form.phone')}</span><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-xl border border-fam-hairline bg-fam-surface px-3 py-2 text-fam-ink" /></label>
          </div>
          {note && <p role="alert" className="mt-3 text-sm text-red-600">{note}</p>}
          <div className="mt-4 flex items-center gap-3">
            <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-fam-on-dark disabled:opacity-60" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}{tr('packs.pay')}
            </button>
            <button type="button" onClick={() => setOpen(null)} className="text-sm font-semibold text-fam-ink-muted">{tr('booking.back')}</button>
          </div>
        </form>
      )}
    </div>
  )
}
