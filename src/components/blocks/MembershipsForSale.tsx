import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { moneyShort, SITE_CURRENCY } from '~/lib/money'
import { tr } from '~/lib/i18n'
import { BUSINESS_ID, SUPABASE_ANON_KEY, SUPABASE_URL } from '~/data/site'

// ★★★ THE MEMBERSHIPS FOR SALE ON THE SITE (ZB-276, 2026-10-14). The live twin of PacksForSale: a read of membership_plans_public
// (the owner's active, unarchived plans) with Subscribe, which asks for the person's name, email and phone and opens a checkout on the
// business's OWN Stripe (membership-checkout, source 'site'); the person comes back to this page with ?joined=1. When the business has
// not connected card payments, Subscribe says so plainly (the function's own message); nothing is invented.
//
// ★★★ NEVER REGRESS THE BUILDER: `fallback` (the baked display-only Membership*Block, exactly as render-section drew it before) is what
// renders FIRST and what stays when the read fails, errors, or answers empty. Only a non-empty live answer swaps it for the live plans,
// so a business with no plans renders byte for byte what it rendered before (same DOM, same classes, no flash).
interface Plan {
  id: string
  name: string
  description: string | null
  price: number | null
  currency: string | null
  interval: 'week' | 'month' | 'year' | null
  interval_count: number | null
  benefit: 'unlimited' | 'credits' | null
  credits_per_period: number | null
  daily_cap: number | null
  trial_days: number | null
}
const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
const money = (n: number, currency?: string | null) => moneyShort(n, currency ?? SITE_CURRENCY)
const fill = (s: string, n: number) => s.replace('{n}', String(n))
type Unit = 'week' | 'month' | 'year'
const unitOf = (p: Plan): Unit => (p.interval === 'week' || p.interval === 'year' ? p.interval : 'month')
const countOf = (p: Plan) => (p.interval_count && p.interval_count > 1 ? p.interval_count : 1)

/** "/ month" or "every 3 months": what follows the price */
export function planCadence(p: Plan): string {
  const u = unitOf(p), c = countOf(p)
  return c > 1 ? fill(tr(`members.every.${u}`), c) : tr(`members.slash.${u}`)
}
/** "Unlimited classes", "8 classes a month", "8 classes every 3 months", then "up to 1 a day" */
export function planGives(p: Plan): string {
  const u = unitOf(p), c = countOf(p)
  const parts: string[] = []
  if (p.benefit === 'credits' && p.credits_per_period) parts.push(`${fill(tr('members.credits'), p.credits_per_period)} ${c > 1 ? fill(tr(`members.every.${u}`), c) : tr(`members.per.${u}`)}`)
  else if (p.benefit !== 'credits') parts.push(tr('members.unlimited'))
  if (p.daily_cap) parts.push(fill(tr('members.dailyCap'), p.daily_cap))
  return parts.join(' · ')
}

export function MembershipsForSale({ label, heading, body, fallback = null }: { label?: string; heading?: string; body?: string; fallback?: React.ReactNode } = {}) {
  const [plans, setPlans] = useState<Plan[] | null>(null)
  const [open, setOpen] = useState<Plan | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const [joined, setJoined] = useState(false)
  useEffect(() => {
    if (!BUSINESS_ID || !SUPABASE_URL) return
    fetch(`${SUPABASE_URL}/rest/v1/membership_plans_public?business_id=eq.${BUSINESS_ID}&select=id,name,description,price,currency,interval,interval_count,benefit,credits_per_period,daily_cap,trial_days&order=display_order.asc,price.asc`, { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Plan[]) => setPlans(Array.isArray(rows) ? rows : []))
      .catch(() => setPlans([]))
    try { setJoined(new URLSearchParams(window.location.search).get('joined') === '1') } catch { /* no window search: nothing to say */ }
  }, [])
  /* the swap: until a NON-EMPTY live answer, exactly what the section drew before */
  if (!plans || plans.length === 0) return <>{fallback}</>

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!open) return
    setBusy(true); setNote(null)
    try {
      const here = `${window.location.origin}${window.location.pathname}`
      const res = await fetch(`${SUPABASE_URL}/functions/v1/membership-checkout`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ businessId: BUSINESS_ID, planId: open.id, customer: { firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), phone: form.phone.trim() }, returnUrl: `${here}?joined=1`, cancelUrl: here, source: 'site' }),
      })
      const data = (await res.json().catch(() => ({}))) as { available?: boolean; url?: string; message?: string }
      if (data.available && data.url) { window.location.href = data.url; return }
      setNote(data.message || tr('packs.notOnline'))
    } catch { setNote(tr('packs.notOnline')) } finally { setBusy(false) }
  }

  return (
    <section className="bg-fam-card" data-membership-section data-memberships-for-sale>
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text"><span className="h-px w-6 bg-fam-accent" />{label ?? tr('blk.membership')}</span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">{heading ?? tr('blk.becomeAMember')}</h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>
        {joined && <p role="status" data-membership-joined className="mt-6 max-w-2xl rounded-2xl border border-fam-hairline bg-fam-surface p-4 text-sm text-fam-ink">{tr('members.joined')}</p>}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.id} data-membership-plan={p.id} className="flex flex-col rounded-2xl border border-fam-hairline bg-fam-surface p-5">
              <div className="font-display text-lg font-semibold text-fam-ink">{p.name}</div>
              <div className="mt-1 text-sm text-fam-ink-muted" data-membership-gives>{planGives(p)}</div>
              {p.trial_days ? <div className="mt-1 text-sm font-semibold text-fam-accent-text" data-membership-trial>{fill(tr('members.trial'), p.trial_days)}</div> : null}
              {p.description && <p className="mt-2 text-sm text-fam-ink-muted">{p.description}</p>}
              <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                {p.price == null ? (
                  <span className="font-display text-base font-semibold text-fam-ink" data-membership-ask>{tr('packs.askPrice')}</span>
                ) : (
                  <>
                    <span className="text-fam-ink"><span className="font-display text-2xl font-semibold">{money(p.price, p.currency)}</span> <span className="text-sm text-fam-ink-muted" data-membership-cadence>{planCadence(p)}</span></span>
                    <button type="button" onClick={() => { setOpen(p); setNote(null) }} className="rounded-full px-5 py-2 text-sm font-semibold text-fam-on-dark" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>
                      {tr('members.subscribe')}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* the same panel PacksForSale opens: the plan and its price, one line on what happens next, the same four fields; nothing is charged here */}
        <DialogPrimitive.Root open={!!open} onOpenChange={(v) => { if (!v && !busy) { setOpen(null); setNote(null) } }}>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-fam-ink/60 backdrop-blur-[2px]" />
            <DialogPrimitive.Content data-membership-panel={open?.id ?? ''} aria-describedby="membership-panel-line" className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-fam-hairline bg-fam-card p-6 shadow-(--elev-4) outline-none">
              {open && (
                <form onSubmit={(e) => void subscribe(e)} data-membership-form>
                  <DialogPrimitive.Title className="font-display text-xl font-semibold text-fam-ink">{open.name}{open.price == null ? '' : ` · ${money(open.price, open.currency)} ${planCadence(open)}`}</DialogPrimitive.Title>
                  <DialogPrimitive.Description id="membership-panel-line" className="mt-1 text-sm text-fam-ink-muted">{open.trial_days ? fill(tr('members.panelLineTrial'), open.trial_days) : tr('members.panelLine')}</DialogPrimitive.Description>
                  <p className="mt-3 text-sm text-fam-ink-muted">{planGives(open)}{open.trial_days ? ` · ${fill(tr('members.trial'), open.trial_days)}` : ''}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <label className="text-sm"><span className="text-fam-ink-muted">{tr('form.firstName')}</span><input required autoFocus value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="mt-1 w-full rounded-xl border border-fam-hairline bg-fam-surface px-3 py-2 text-fam-ink" /></label>
                    <label className="text-sm"><span className="text-fam-ink-muted">{tr('form.lastName')}</span><input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="mt-1 w-full rounded-xl border border-fam-hairline bg-fam-surface px-3 py-2 text-fam-ink" /></label>
                    <label className="text-sm"><span className="text-fam-ink-muted">{tr('form.email')}</span><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-xl border border-fam-hairline bg-fam-surface px-3 py-2 text-fam-ink" /></label>
                    <label className="text-sm"><span className="text-fam-ink-muted">{tr('form.phone')}</span><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-xl border border-fam-hairline bg-fam-surface px-3 py-2 text-fam-ink" /></label>
                  </div>
                  {note && <p role="alert" className="mt-3 text-sm text-red-600">{note}</p>}
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button type="submit" data-membership-continue disabled={busy} className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-fam-on-dark disabled:opacity-60" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>
                      {busy && <Loader2 className="h-4 w-4 animate-spin" />}{tr('packs.continue')}
                    </button>
                    <DialogPrimitive.Close asChild><button type="button" data-membership-back className="text-sm font-semibold text-fam-ink-muted">{tr('booking.back')}</button></DialogPrimitive.Close>
                  </div>
                </form>
              )}
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      </div>
    </section>
  )
}
