import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, BUSINESS_ID } from '~/data/site'
import { tr } from '~/lib/i18n'

/**
 * ★★★ THE PERSON IS KNOWN AFTER THE CODE, NEVER BEFORE (ZB-224, the owner, 2026-10-09).
 *   1 the phone: a code goes to it (the server answers the same for a known and an unknown number, so the page cannot be used to ask
 *     "is this person a customer here")
 *   2 the code
 *   3 after the code is right the server says who this is: a person with a name on file is filled in and goes straight on (no name
 *     step, their credits shown); a new person is asked their name now, after the code, never before.
 * A business with no texting number sends the code by email: a new person is asked their email at the phone step only then.
 * Shared by the class flow and the appointment wizard. Every fact comes from the portal functions; this page never names the person.
 */
export type Verified = { token: string; known: boolean; credits: number; phone: string; profile: { firstName: string; lastName: string; email: string } }
export const PORTAL_SESSION_KEY = 'zmode_portal_session'
const HEADERS = { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
type Phase = 'phone' | 'code' | 'name'

export async function portalCall(name: string, body: Record<string, unknown>, sess?: string | null) {
  try {
    const r = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, { method: 'POST', headers: sess ? { ...HEADERS, 'x-portal-session': sess } : HEADERS, body: JSON.stringify(body) })
    return { ok: r.ok, status: r.status, data: (await r.json().catch(() => ({}))) as Record<string, unknown> }
  } catch { return { ok: false, status: 0, data: { error: tr('booking.couldNotComplete') } } }
}

/** a session from the last half hour (the same visit, or back from the sign page): who it is, read from the portal, never typed */
export async function restoreVerified(): Promise<Verified | null> {
  let sess: string | null = null
  try { sess = window.sessionStorage.getItem(PORTAL_SESSION_KEY) } catch { return null }
  if (!sess) return null
  const { ok, status, data } = await portalCall('portal-read', { businessId: BUSINESS_ID }, sess)
  if (!ok) { if (status === 401) { try { window.sessionStorage.removeItem(PORTAL_SESSION_KEY) } catch { /* nothing */ } } return null }
  const c = (data.customer ?? {}) as { firstName?: string | null; lastName?: string | null }
  const packs = (Array.isArray(data.packs) ? data.packs : []) as Array<{ balance?: number | null; status?: string | null }>
  const credits = packs.filter((p) => !p.status || p.status === 'active').reduce((n, p) => n + Math.max(0, Number(p.balance ?? 0)), 0)
  const first = String(c.firstName ?? '').trim()
  return { token: sess, known: !!first, credits, phone: '', profile: { firstName: first, lastName: String(c.lastName ?? '').trim(), email: '' } }
}

/* ★ declared ONCE at module scope: a component declared inside a component remounts on every keystroke and loses the caret */
export function Field({ label, value, onChange, type, auto, required, name }: { label: string; value: string; onChange: (v: string) => void; type?: string; auto?: string; required?: boolean; name?: string }) {
  return (
    <label className="block"><span className="font-display text-sm font-medium text-ink-900">{label} {required && <span className="text-brand-700">*</span>}</span>
      <input type={type ?? 'text'} name={name} required={required} inputMode={type === 'tel' ? 'tel' : undefined} autoComplete={auto} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-xl border bg-fam-card px-4 py-3 text-base text-ink-900 outline-none transition-colors focus:border-brand-600 focus:ring-1 focus:ring-brand-600" style={{ borderColor: 'var(--wow-hairline)' }} />
    </label>
  )
}
export function Primary({ children, disabled, busy, tag, onClick, type = 'button' }: { children: React.ReactNode; disabled?: boolean; busy?: boolean; tag?: string; onClick?: () => void; type?: 'button' | 'submit' }) {
  return (
    <button type={type} data-class-action={tag} disabled={disabled || busy} onClick={onClick} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 font-display text-sm font-semibold text-fam-on-dark transition-[filter] hover:brightness-(--hover-brightness) disabled:opacity-60" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>
      {busy && <Loader2 className="h-4 w-4 animate-spin" />}{children}
    </button>
  )
}

export function PhoneCodeStep({ onVerified, intro, initialPhone }: { onVerified: (v: Verified) => void; intro?: string; initialPhone?: string }) {
  const [phase, setPhase] = useState<Phase>('phone')
  const [phone, setPhone] = useState(initialPhone ?? '')
  const [email, setEmail] = useState('')
  const [needEmail, setNeedEmail] = useState(false)
  const [via, setVia] = useState<'text' | 'email'>('text')
  const [code, setCode] = useState('')
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [pending, setPending] = useState<Verified | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendCode = async () => {
    setBusy(true); setError(null)
    const { data } = await portalCall('portal-start', { businessId: BUSINESS_ID, phone: phone.trim(), create: true, ...(email.trim() ? { email: email.trim() } : {}) })
    setBusy(false)
    if (data.error === 'portal_off') { setError(tr('booking.portalOff')); return }
    /* the business has no number to text from and knows no email for this person: the code can only go by email */
    if (data.need_email === true || (data.sent === false && data.via === 'text')) { setNeedEmail(true); return }
    setVia((data.via as 'text' | 'email') ?? 'text'); setPhase('code')
  }
  const verify = async () => {
    setBusy(true); setError(null)
    const { ok, data } = await portalCall('portal-verify', { businessId: BUSINESS_ID, phone: phone.trim(), code: code.trim() })
    if (!ok || typeof data.token !== 'string') { setBusy(false); setError(tr('portal.wrongCode')); return }
    try { window.sessionStorage.setItem(PORTAL_SESSION_KEY, data.token) } catch { /* not kept */ }
    const p = (data.profile ?? {}) as { firstName?: string | null; lastName?: string | null; email?: string | null }
    const v: Verified = { token: data.token, known: data.known === true, credits: Number(data.credits ?? 0) || 0, phone: phone.trim(), profile: { firstName: String(p.firstName ?? '').trim(), lastName: String(p.lastName ?? '').trim(), email: String(p.email ?? '').trim() || email.trim() } }
    setBusy(false)
    if (v.known) { onVerified(v); return }
    setPending(v); setPhase('name')
  }
  const saveName = async () => {
    if (!pending) return
    setBusy(true); setError(null)
    const { ok, data } = await portalCall('portal-profile', { firstName: first.trim(), lastName: last.trim(), ...(email.trim() ? { email: email.trim() } : {}) }, pending.token)
    setBusy(false)
    if (!ok) { setError(tr('booking.couldNotComplete')); return }
    const p = (data.profile ?? {}) as { firstName?: string | null; lastName?: string | null; email?: string | null }
    onVerified({ ...pending, known: true, profile: { firstName: String(p.firstName ?? first).trim(), lastName: String(p.lastName ?? last).trim(), email: String(p.email ?? '').trim() || email.trim() } })
  }

  if (phase === 'phone') return (
    <form data-booking-step="phone" className="grid gap-4" onSubmit={(e) => { e.preventDefault(); void sendCode() }}>
      <p className="text-sm text-ink-700">{intro ?? tr('booking.whoIntro')}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={tr('form.phone')} name="phone" type="tel" auto="tel" required value={phone} onChange={setPhone} />
        {needEmail && <Field label={tr('form.email')} name="email" type="email" auto="email" required value={email} onChange={setEmail} />}
      </div>
      {needEmail && <p data-booking-need-email className="text-sm text-ink-700">{tr('booking.codeNeedsEmail')}</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div><Primary busy={busy} type="submit" tag="send-code" disabled={phone.replace(/\D/g, '').length < 10 || (needEmail && !email.trim())}>{tr('portal.sendCode')}</Primary></div>
      <p className="text-xs text-ink-600">{tr('portal.noAccount')}</p>
    </form>
  )
  if (phase === 'code') return (
    <form data-booking-step="code" className="grid gap-4" onSubmit={(e) => { e.preventDefault(); void verify() }}>
      <p className="text-sm text-ink-700">{via === 'email' ? tr('portal.codeByEmail') : tr('portal.codeByText')}</p>
      <Field label={tr('portal.code')} name="code" auto="one-time-code" required value={code} onChange={setCode} />
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap items-center gap-4"><Primary busy={busy} type="submit" tag="verify" disabled={code.replace(/\D/g, '').length < 6}>{tr('booking.continue')}</Primary><button type="button" onClick={() => { setPhase('phone'); setCode('') }} className="text-sm text-brand-700 underline-offset-2 hover:underline">{tr('booking.changeNumber')}</button></div>
    </form>
  )
  return (
    <form data-booking-step="name" className="grid gap-4" onSubmit={(e) => { e.preventDefault(); void saveName() }}>
      <p className="text-sm text-ink-700">{tr('booking.nameAfterCode')}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={tr('form.firstName')} name="firstName" auto="given-name" required value={first} onChange={setFirst} />
        <Field label={tr('form.lastName')} name="lastName" auto="family-name" value={last} onChange={setLast} />
        {!pending?.profile.email && !email && <Field label={tr('form.email')} name="email" type="email" auto="email" value={email} onChange={setEmail} />}
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div><Primary busy={busy} type="submit" tag="save-name" disabled={!first.trim()}>{tr('booking.continue')}</Primary></div>
    </form>
  )
}

/** the line above a booking in progress: who it is for, and the classes they hold (never typed, read after the code) */
export function BookingFor({ me, onChange }: { me: Verified; onChange?: () => void }) {
  const name = [me.profile.firstName, me.profile.lastName].filter(Boolean).join(' ')
  return (
    <p data-booking-me className="text-sm text-ink-700">
      <span className="font-medium text-ink-900">{tr('booking.bookingFor')} {name || tr('booking.you')}</span>
      {me.credits > 0 && <span data-booking-credits> · {me.credits} {tr('booking.creditsLeft')}</span>}
      {onChange && <button type="button" onClick={onChange} className="ml-2 text-brand-700 underline-offset-2 hover:underline">{tr('booking.changeNumber')}</button>}
    </p>
  )
}
