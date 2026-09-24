import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, BUSINESS_ID, SITE } from '~/data/site'
import { tr } from '~/lib/i18n'
import { liveClassesUrl, type LiveClass } from '~/lib/useClassSchedule'
import { HeldBookingFlow, type HeldEntry, type HeldOptions } from '~/components/blocks/HeldBookingFlow'
import { hasPhone } from '~/lib/phone'

/**
 * ★★★ THE PORTAL IS THE BETTER DOOR FOR SOMEONE WHO ALREADY BELONGS (the owner, 2026-09-24), never a gate on the way in.
 * A returning customer signs in with their number and a code (the code goes by text from the business's own number, by email
 * when the business has none, and the page says which), sees their classes left and their bookings, picks a class and a spot,
 * done, nothing typed. Every fact shown comes from portal-read; a booking runs through create-booking with the session,
 * which names the person, so the same rows land as from the site or by asking. The business decides whether the portal is on.
 */
const HEADERS = { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
const SESSION_KEY = 'zmode_portal_session'
type Phase = 'checking' | 'off' | 'phone' | 'code' | 'home' | 'classes' | 'booking' | 'held'
type Payload = { customer: { firstName: string | null; lastName: string | null }; bookings: Array<{ id: string; startTime: string; status: string; upcoming: boolean; serviceName?: string | null; classTitle?: string | null; seatNo?: number | null; cancellable?: boolean }>; packs: Array<{ id: string; packName?: string | null; balance: number; totalGranted?: number; status: string; expiresAt?: string | null }> }

const money = (n: number) => `$${Number(n).toFixed(2).replace(/\.00$/, '')}`
const when = (iso: string) => new Date(iso).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export function CustomerPortal() {
  const [phase, setPhase] = useState<Phase>('checking')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [via, setVia] = useState<'text' | 'email' | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [me, setMe] = useState<Payload | null>(null)
  const [classes, setClasses] = useState<LiveClass[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [held, setHeld] = useState<HeldEntry | null>(null)
  const [cancelAsk, setCancelAsk] = useState<{ id: string; words: string } | null>(null)

  const fn = async (name: string, body: Record<string, unknown>, sess?: string | null) => {
    /* the session rides in the body (every portal function reads it there too), so no function needs a custom header allowed */
    try {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, { method: 'POST', headers: HEADERS, body: JSON.stringify(sess ? { ...body, token: sess } : body) })
      return { ok: r.ok, status: r.status, data: (await r.json().catch(() => ({}))) as Record<string, unknown> }
    } catch {
      return { ok: false, status: 0, data: { error: tr('booking.couldNotComplete') } }
    }
  }
  const load = async (sess: string) => {
    const { ok, status, data } = await fn('portal-read', { businessId: BUSINESS_ID }, sess)
    if (status === 404 && data.error === 'portal_off') { setPhase('off'); return }
    if (!ok) { try { window.sessionStorage.removeItem(SESSION_KEY) } catch { /* nothing */ } setToken(null); setPhase('phone'); return }
    setMe(data as unknown as Payload); setPhase('home')
  }
  useEffect(() => {
    void (async () => {
      try {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/website_config?business_id=eq.${BUSINESS_ID}&select=features_enabled`, { headers: HEADERS })
        const rows = (await r.json()) as Array<{ features_enabled: { portal?: boolean } | null }>
        if (rows[0]?.features_enabled?.portal !== true) { setPhase('off'); return }
      } catch { setPhase('off'); return }
      let sess: string | null = null
      try { sess = window.sessionStorage.getItem(SESSION_KEY) } catch { /* none */ }
      const q = new URLSearchParams(window.location.search)
      const bk = q.get('booking'); const t = q.get('t'); const heldId = q.get('held')
      if ((bk && t && q.get('paid') === '1') || (heldId && t)) { setHeld({ bookingId: (bk ?? heldId) as string, token: t as string, initial: 'confirming' }); setToken(sess); setPhase('held'); return }
      if (sess) { setToken(sess); await load(sess) } else setPhase('phone')
    })()
  }, [])

  const start = async () => {
    setBusy(true); setError(null)
    const { data } = await fn('portal-start', { businessId: BUSINESS_ID, phone })
    setBusy(false)
    if (data.error === 'portal_off') { setPhase('off'); return }
    setVia((data.via as 'text' | 'email') ?? 'text'); setPhase('code')
  }
  const verify = async () => {
    setBusy(true); setError(null)
    const { ok, data } = await fn('portal-verify', { businessId: BUSINESS_ID, phone, code })
    setBusy(false)
    if (!ok || typeof data.token !== 'string') { setError(tr('portal.wrongCode')); return }
    try { window.sessionStorage.setItem(SESSION_KEY, data.token) } catch { /* not kept */ }
    setToken(data.token); await load(data.token)
  }
  const signOut = () => { try { window.sessionStorage.removeItem(SESSION_KEY) } catch { /* nothing */ } setToken(null); setMe(null); setPhase('phone') }
  const openClasses = async () => {
    setBusy(true)
    try { const r = await fetch(liveClassesUrl(BUSINESS_ID, 21), { headers: HEADERS }); setClasses((await r.json()) as LiveClass[]) } catch { setClasses([]) }
    setBusy(false); setPhase('classes')
  }
  const book = async (c: LiveClass) => {
    if (!token) return
    setBusy(true); setError(null)
    const { ok, data } = await fn('create-booking', { businessId: BUSINESS_ID, serviceId: c.service_id, occurrenceId: c.id, hold: true, source: 'portal' }, token)
    setBusy(false)
    const d = data as { success?: boolean; held?: boolean; error?: string; booking?: { id?: string }; hold?: { token?: string; expires_at?: string }; options?: HeldOptions }
    if (!ok || !d.success || !d.booking?.id || !d.hold?.token) { setError(d.error || tr('booking.couldNotComplete')); return }
    setHeld({ bookingId: d.booking.id, token: d.hold.token, initial: d.held ? 'pay' : 'after', expiresAt: d.hold.expires_at ?? null, options: d.options ?? null })
    setPhase('held')
  }
  const cancelPreview = async (id: string) => {
    if (!token) return
    const { data } = await fn('portal-cancel', { businessId: BUSINESS_ID, bookingId: id, preview: true }, token)
    const restored = data.creditRestored === true
    setCancelAsk({ id, words: restored ? tr('portal.cancelBack') : tr('portal.cancelKeep') })
  }
  const cancelNow = async () => {
    if (!token || !cancelAsk) return
    setBusy(true); await fn('portal-cancel', { businessId: BUSINESS_ID, bookingId: cancelAsk.id }, token); setCancelAsk(null); await load(token); setBusy(false)
  }

  const Box = ({ children, tag }: { children: React.ReactNode; tag: string }) => (
    <div data-portal={tag} className="rounded-2xl border bg-fam-card p-5" style={{ borderColor: 'var(--wow-hairline)' }}>{children}</div>
  )
  const Primary = ({ children, onClick, disabled, tag, type = 'button' }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; tag?: string; type?: 'button' | 'submit' }) => (
    <button type={type} data-portal-action={tag} disabled={disabled || busy} onClick={onClick} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 font-display text-sm font-semibold text-fam-on-dark disabled:opacity-60" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{children}</button>
  )
  const Field = ({ label, value, onChange, type, auto }: { label: string; value: string; onChange: (v: string) => void; type?: string; auto?: string }) => (
    <label className="block"><span className="font-display text-sm font-medium text-ink-900">{label}</span>
      <input type={type ?? 'text'} inputMode={type === 'tel' ? 'tel' : 'numeric'} autoComplete={auto} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full rounded-xl border bg-fam-card px-4 py-3 text-base text-ink-900 outline-none focus:border-brand-600" style={{ borderColor: 'var(--wow-hairline)' }} /></label>
  )

  if (phase === 'checking') return <p className="flex items-center gap-2 text-sm text-ink-700"><Loader2 className="h-4 w-4 animate-spin" />…</p>
  if (phase === 'off') return <Box tag="off"><p className="text-ink-700">{tr('portal.off')}{hasPhone(SITE.phone) ? ` ${tr('portal.callUs')} ${SITE.phoneDisplay}.` : ''}</p></Box>
  if (phase === 'phone') return (
    <Box tag="phone">
      <p className="text-sm text-ink-700">{tr('portal.phoneIntro')}</p>
      <form className="mt-4 grid gap-4" onSubmit={(e) => { e.preventDefault(); void start() }}>
        <Field label={tr('form.phone')} type="tel" auto="tel" value={phone} onChange={setPhone} />
        <div><Primary type="submit" tag="send-code" disabled={phone.replace(/\D/g, '').length < 10}>{tr('portal.sendCode')}</Primary></div>
      </form>
      <p className="mt-4 text-xs text-ink-600">{tr('portal.noAccount')}</p>
    </Box>
  )
  if (phase === 'code') return (
    <Box tag="code">
      <p className="text-sm text-ink-700">{via === 'email' ? tr('portal.codeByEmail') : tr('portal.codeByText')}</p>
      <form className="mt-4 grid gap-4" onSubmit={(e) => { e.preventDefault(); void verify() }}>
        <Field label={tr('portal.code')} auto="one-time-code" value={code} onChange={setCode} />
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <div className="flex flex-wrap items-center gap-4"><Primary type="submit" tag="verify" disabled={code.replace(/\D/g, '').length < 6}>{tr('portal.signIn')}</Primary><button type="button" onClick={() => setPhase('phone')} className="text-sm text-ink-600 underline-offset-2 hover:underline">{tr('booking.back')}</button></div>
      </form>
    </Box>
  )
  if (phase === 'held' && held) return (
    <div>
      <HeldBookingFlow entry={held} onReleased={() => { setHeld(null); if (token) void load(token); else setPhase('phone'); if (typeof window !== 'undefined') window.history.replaceState(null, '', window.location.pathname) }} />
      {token && <div className="mt-6 text-center"><button type="button" data-portal-action="home" onClick={() => { setHeld(null); void load(token); if (typeof window !== 'undefined') window.history.replaceState(null, '', window.location.pathname) }} className="text-sm text-brand-700 underline-offset-2 hover:underline">{tr('portal.backHome')}</button></div>}
    </div>
  )
  if (phase === 'classes') return (
    <Box tag="classes">
      <div className="flex items-center justify-between"><h3 className="font-display text-lg font-semibold text-ink-900">{tr('portal.pickClass')}</h3><button type="button" onClick={() => setPhase('home')} className="text-sm text-ink-600 underline-offset-2 hover:underline">{tr('booking.back')}</button></div>
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-4 grid gap-2">
        {classes.length === 0 && <p className="text-sm text-ink-700">{tr('portal.noClasses')}</p>}
        {classes.map((c) => { const full = typeof c.seats_left === 'number' && c.seats_left <= 0; return (
          <button key={c.id} type="button" data-portal-class={c.id} disabled={busy || full} onClick={() => void book(c)} className="flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm text-ink-900 disabled:opacity-50" style={{ borderColor: 'var(--wow-hairline)' }}>
            <span><span className="font-semibold">{c.title}</span> · {when(c.start_at)}{c.instructor ? ` · ${c.instructor}` : ''}</span>
            <span className="text-xs">{typeof c.seats_left === 'number' ? (full ? tr('booking.classFull') : `${c.seats_left} ${tr('schedule.spots')}`) : ''}</span>
          </button>) })}
      </div>
    </Box>
  )
  const packs = (me?.packs ?? []).filter((p) => p.status === 'active' && p.balance > 0); const upcoming = (me?.bookings ?? []).filter((b) => b.status !== 'cancelled' && b.upcoming).sort((x, y) => x.startTime.localeCompare(y.startTime))
  return (
    <div className="grid gap-4">
      <Box tag="home">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink-900">{me?.customer.firstName ? `${tr('portal.hello')} ${me.customer.firstName}` : tr('portal.yourBookings')}</h3>
          <button type="button" data-portal-action="sign-out" onClick={signOut} className="text-sm text-ink-600 underline-offset-2 hover:underline">{tr('portal.signOut')}</button>
        </div>
        <div className="mt-3 grid gap-1 text-sm text-ink-700" data-portal-packs>
          {packs.length === 0 && <span>{tr('portal.noPacks')}</span>}
          {packs.map((p) => <span key={p.id}>{p.packName ?? tr('portal.pack')}: <strong>{p.balance}</strong> {p.balance === 1 ? tr('portal.classOne') : tr('portal.classMany')}{p.expiresAt ? ` · ${tr('portal.until')} ${new Date(p.expiresAt).toLocaleDateString()}` : ''}</span>)}
        </div>
        <div className="mt-4"><Primary tag="book" onClick={() => void openClasses()}>{tr('portal.bookClass')}</Primary></div>
      </Box>
      <Box tag="bookings">
        <h4 className="font-display text-base font-semibold text-ink-900">{tr('portal.upcoming')}</h4>
        <div className="mt-2 grid gap-2 text-sm text-ink-700">
          {upcoming.length === 0 && <span>{tr('portal.nothingUpcoming')}</span>}
          {upcoming.map((b) => (
            <div key={b.id} data-portal-booking={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2" style={{ borderColor: 'var(--wow-hairline)' }}>
              <span><strong>{b.classTitle ?? b.serviceName ?? ''}</strong> · {when(b.startTime)}{b.seatNo ? ` · ${tr('booking.yourSpot').replace('{n}', String(b.seatNo))}` : ''}</span>
              {!b.cancellable ? null : cancelAsk?.id === b.id ? (
                <span className="flex items-center gap-3"><span className="text-xs">{cancelAsk.words}</span><button type="button" data-portal-action="cancel-yes" onClick={() => void cancelNow()} className="text-xs font-semibold text-red-700">{tr('portal.cancelYes')}</button><button type="button" onClick={() => setCancelAsk(null)} className="text-xs">{tr('portal.keep')}</button></span>
              ) : (
                <button type="button" data-portal-action="cancel" onClick={() => void cancelPreview(b.id)} className="text-xs text-ink-600 underline-offset-2 hover:underline">{tr('portal.cancel')}</button>
              )}
            </div>
          ))}
        </div>
      </Box>
    </div>
  )
}
