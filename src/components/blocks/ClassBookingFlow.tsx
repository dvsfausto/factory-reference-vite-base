import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, BUSINESS_ID } from '~/data/site'
import { tr } from '~/lib/i18n'
import type { HeldEntry, HeldOptions } from '~/components/blocks/HeldBookingFlow'

/**
 * ★★★ THE FLOW ORDER (the owner, 2026-09-24): for a CLASS, the person is known before the seat is touched.
 *   the class first (they came for it) → 1 their number (new here: name too) → 2 the code (the account is made by the code, no
 *   password; it is what makes the pack theirs and stops a double booking) → 3 the class is booked: a credit is spent, or the seat is
 *   HELD while they buy a pack or a single class → 4 the seat is locked → 5 the waiver, first time only, now that the seat is theirs
 *   (HeldBookingFlow; it comes back after signing) → 6 the spot pick. A waiver before a chosen class or a payment loses people.
 * A returning person: number → code → straight to the class (the waiver already signed). A session lasts 30 minutes, so a second
 * class in the same visit needs no second code. Every fact comes from the portal functions; the caller never names the person.
 */
type Phase = 'who' | 'code' | 'waiver' | 'booking'
const HEADERS = { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
const SESSION_KEY = 'zmode_portal_session'
const REMEMBER_KEY = 'zmode_booking_me'

export function ClassBookingFlow({ occurrence, serviceId, onHeld }: { occurrence: { id: string; title: string }; serviceId: string | null; onHeld: (entry: HeldEntry) => void }) {
  const [phase, setPhase] = useState<Phase>('who')
  const [phone, setPhone] = useState('')
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [known, setKnown] = useState<boolean | null>(null)
  const [code, setCode] = useState('')
  const [via, setVia] = useState<'text' | 'email'>('text')
  const [token, setToken] = useState<string | null>(null)
  const [waiver, setWaiver] = useState<{ required: boolean; signed: boolean; link: string | null } | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fn = async (name: string, body: Record<string, unknown>, sess?: string | null) => {
    try {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, { method: 'POST', headers: HEADERS, body: JSON.stringify(sess ? { ...body, token: sess } : body) })
      return { ok: r.ok, status: r.status, data: (await r.json().catch(() => ({}))) as Record<string, unknown> }
    } catch { return { ok: false, status: 0, data: { error: tr('booking.couldNotComplete') } } }
  }
  /* a session from the last half hour (the same visit, or back from the sign page) skips the code */
  useEffect(() => {
    let sess: string | null = null
    try { sess = window.sessionStorage.getItem(SESSION_KEY); const me = window.localStorage.getItem(REMEMBER_KEY); if (me) { const m = JSON.parse(me) as { phone?: string; firstName?: string; lastName?: string; email?: string }; setPhone(m.phone ?? ''); setFirst(m.firstName ?? ''); setLast(m.lastName ?? ''); setEmail(m.email ?? '') } } catch { /* none */ }
    if (sess) { setToken(sess); void book(sess) }   // the same visit: no second code, straight to the class
  }, [])
  useEffect(() => {
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 10) { setKnown(null); return }
    let stale = false
    const id = setTimeout(async () => { const { data } = await fn('booking-lookup', { businessId: BUSINESS_ID, phone: phone.trim() }); if (!stale) setKnown(data.known === true) }, 400)
    return () => { stale = true; clearTimeout(id) }
  }, [phone])

  const sendCode = async () => {
    setBusy(true); setError(null)
    const { data } = await fn('portal-start', { businessId: BUSINESS_ID, phone: phone.trim(), create: true, firstName: first.trim(), lastName: last.trim(), email: email.trim() })
    setBusy(false)
    if (data.error === 'portal_off') { setError(tr('booking.portalOff')); return }
    try { window.localStorage.setItem(REMEMBER_KEY, JSON.stringify({ phone: phone.trim(), firstName: first.trim(), lastName: last.trim(), email: email.trim() })) } catch { /* not kept */ }
    setVia((data.via as 'text' | 'email') ?? 'text'); setPhase('code')
  }
  const verify = async () => {
    setBusy(true); setError(null)
    const { ok, data } = await fn('portal-verify', { businessId: BUSINESS_ID, phone: phone.trim(), code: code.trim() })
    if (!ok || typeof data.token !== 'string') { setBusy(false); setError(tr('portal.wrongCode')); return }
    try { window.sessionStorage.setItem(SESSION_KEY, data.token) } catch { /* not kept */ }
    setToken(data.token); setBusy(false)
    await book(data.token)
  }
  const checkWaiver = async (sess: string) => {
    setBusy(true); setError(null); setPhase('waiver')
    const { ok, status, data } = await fn('portal-waiver', { businessId: BUSINESS_ID }, sess)
    setBusy(false)
    if (status === 401) { try { window.sessionStorage.removeItem(SESSION_KEY) } catch { /* nothing */ } setToken(null); setPhase('who'); return }
    const w = ok ? { required: data.required !== false, signed: data.signed === true, link: typeof data.link === 'string' ? data.link : null } : { required: false, signed: true, link: null }
    setWaiver(w)
    if (!w.required || w.signed) await book(sess)
  }
  const signLink = (link: string) => {
    const back = `${window.location.origin}${window.location.pathname}?occurrence=${occurrence.id}&resume=waiver`
    return `${link}${link.includes('?') ? '&' : '?'}return=${encodeURIComponent(back)}`
  }
  const book = async (sess: string) => {
    setBusy(true); setError(null); setPhase('booking')
    const { ok, data } = await fn('create-booking', { businessId: BUSINESS_ID, ...(serviceId ? { serviceId } : {}), occurrenceId: occurrence.id, hold: true, source: 'portal' }, sess)
    setBusy(false)
    const d = data as { success?: boolean; held?: boolean; already?: boolean; message?: string; error?: string; booking?: { id?: string }; hold?: { token?: string; expires_at?: string }; options?: HeldOptions }
    if (!ok || !d.success || !d.booking?.id || !d.hold?.token) { setError(d.error || tr('booking.couldNotComplete')); setPhase('who'); return }
    onHeld({ bookingId: d.booking.id, token: d.hold.token, initial: d.held ? 'pay' : 'after', expiresAt: d.hold.expires_at ?? null, options: d.options ?? null, note: d.already ? (d.message ?? null) : null })
  }

  const Field = ({ label, value, onChange, type, auto, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; auto?: string; required?: boolean }) => (
    <label className="block"><span className="font-display text-sm font-medium text-ink-900">{label} {required && <span className="text-brand-700">*</span>}</span>
      <input type={type ?? 'text'} required={required} inputMode={type === 'tel' ? 'tel' : undefined} autoComplete={auto} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-xl border bg-fam-card px-4 py-3 text-base text-ink-900 outline-none focus:border-brand-600" style={{ borderColor: 'var(--wow-hairline)' }} /></label>
  )
  const Primary = ({ children, disabled, tag, onClick, type = 'button' }: { children: React.ReactNode; disabled?: boolean; tag?: string; onClick?: () => void; type?: 'button' | 'submit' }) => (
    <button type={type} data-class-action={tag} disabled={disabled || busy} onClick={onClick} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 font-display text-sm font-semibold text-fam-on-dark disabled:opacity-60" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{children}</button>
  )

  if (phase === 'who') return (
    <form data-class-step="who" className="grid gap-4" onSubmit={(e) => { e.preventDefault(); void sendCode() }}>
      <p className="text-sm text-ink-700">{tr('booking.whoIntro')}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={tr('form.phone')} type="tel" auto="tel" required value={phone} onChange={setPhone} />
        {known === true && <div data-booking-known className="flex items-end text-sm text-ink-700">{tr('booking.welcomeBack')}</div>}
      </div>
      {known === false && (
        <div data-class-new className="grid gap-4">
          <p className="text-sm text-ink-700">{tr('booking.newHere')}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={tr('form.firstName')} auto="given-name" required value={first} onChange={setFirst} />
            <Field label={tr('form.lastName')} auto="family-name" value={last} onChange={setLast} />
            <Field label={tr('form.email')} type="email" auto="email" value={email} onChange={setEmail} />
          </div>
        </div>
      )}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div><Primary type="submit" tag="send-code" disabled={phone.replace(/\D/g, '').length < 10 || (known === false && !first.trim())}>{tr('portal.sendCode')}</Primary></div>
      <p className="text-xs text-ink-600">{tr('portal.noAccount')}</p>
    </form>
  )
  if (phase === 'code') return (
    <form data-class-step="code" className="grid gap-4" onSubmit={(e) => { e.preventDefault(); void verify() }}>
      <p className="text-sm text-ink-700">{via === 'email' ? tr('portal.codeByEmail') : tr('portal.codeByText')}</p>
      <Field label={tr('portal.code')} auto="one-time-code" required value={code} onChange={setCode} />
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap items-center gap-4"><Primary type="submit" tag="verify" disabled={code.replace(/\D/g, '').length < 6}>{tr('booking.continue')}</Primary><button type="button" onClick={() => setPhase('who')} className="text-sm text-ink-600 underline-offset-2 hover:underline">{tr('booking.back')}</button></div>
    </form>
  )
  if (phase === 'waiver') return (
    <div data-class-step="waiver" className="grid gap-4">
      {!waiver || busy ? <p className="flex items-center gap-2 text-sm text-ink-700"><Loader2 className="h-4 w-4 animate-spin" />{tr('booking.checkingWaiver')}</p> : (
        <>
          <p className="text-sm text-ink-700">{tr('booking.waiverFirst')}</p>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-wrap gap-3">
            {waiver.link && <a href={signLink(waiver.link)} data-class-action="sign" className="inline-flex h-12 items-center justify-center rounded-xl px-7 font-display text-sm font-semibold text-fam-on-dark" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>{tr('booking.waiverSign')}</a>}
            <button type="button" data-class-action="signed" onClick={() => token && void checkWaiver(token)} className="inline-flex h-12 items-center rounded-xl border px-5 text-sm font-semibold text-ink-900" style={{ borderColor: 'var(--wow-hairline)' }}>{tr('booking.waiverDone')}</button>
          </div>
        </>
      )}
    </div>
  )
  return <p data-class-step="booking" className="flex items-center gap-2 text-sm text-ink-700"><Loader2 className="h-4 w-4 animate-spin" />{tr('booking.submitting')}</p>
}
