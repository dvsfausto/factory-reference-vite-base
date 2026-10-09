import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, BUSINESS_ID } from '~/data/site'
import { tr } from '~/lib/i18n'
import type { HeldEntry, HeldOptions } from '~/components/blocks/HeldBookingFlow'
import { PhoneCodeStep, BookingFor, restoreVerified, PORTAL_SESSION_KEY, type Verified } from '~/components/blocks/PhoneCodeStep'

/**
 * ★★★ THE FLOW ORDER (the owner, 2026-09-24; ZB-224, 2026-10-09): for a CLASS, the person is known before the seat is touched.
 *   the class first (they came for it) → 1 their number → 2 the code (the account is made by the code, no password; it is what makes
 *   the pack theirs and stops a double booking) → 3 the server says who this is: a person with a name on file goes straight on, their
 *   credits shown; a new person gives their name NOW, after the code, never before → 4 the class is booked: a credit is spent, or the
 *   seat is HELD while they buy a pack or a single class → 5 the seat is locked → 6 the waiver, first time only, now that the seat is
 *   theirs (★ 2026-10-04: a business that requires the signature BEFORE the booking keeps the seat held after the payment until it is
 *   signed; this page says it knows that step with waiverAfterPay, and HeldBookingFlow shows the sign card with no "later")
 *   (HeldBookingFlow; it comes back after signing) → 7 the spot pick, only for a class in a room (no room = a spot count, the
 *   owner's model 2026-09-29). A waiver before a chosen class or a payment loses people.
 * A returning person: number → code → straight to the class (no name typed, the waiver already signed). A session lasts 30 minutes, so
 * a second class in the same visit needs no second code. Every fact comes from the portal functions; the caller never names the person.
 */
type Phase = 'who' | 'waiver' | 'booking'
const HEADERS = { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
const SESSION_KEY = PORTAL_SESSION_KEY

/* a class is booked by its KIND (the owner, 2026-09-29): kindId, never a service id */
export function ClassBookingFlow({ occurrence, kindId, onHeld, onVerified }: { occurrence: { id: string; title: string }; kindId: string | null; onHeld: (entry: HeldEntry) => void; onVerified?: (v: Verified) => void }) {
  const [phase, setPhase] = useState<Phase>('who')
  const [me, setMe] = useState<Verified | null>(null)
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
  /* a session from the last half hour (the same visit, or back from the sign page) skips the code; who it is comes from the portal */
  useEffect(() => {
    let sess: string | null = null
    try { sess = window.sessionStorage.getItem(SESSION_KEY) } catch { /* nothing kept */ }
    if (!sess) return
    setToken(sess)
    void restoreVerified().then((v) => { if (v) { setMe(v); onVerified?.(v) } })
    void book(sess)   // the same visit: no second code, straight to the class
  }, [])
  const verified = (v: Verified) => {
    setMe(v); setToken(v.token); onVerified?.(v)
    void book(v.token)
  }
  const checkWaiver = async (sess: string) => {
    setBusy(true); setError(null); setPhase('waiver')
    const { ok, status, data } = await fn('portal-waiver', { businessId: BUSINESS_ID }, sess)
    setBusy(false)
    if (status === 401) { try { window.sessionStorage.removeItem(SESSION_KEY) } catch { /* nothing */ } setToken(null); setPhase('who'); return }
    const w = ok ? { required: data.required !== false, signed: data.signed === true, link: typeof data.link === 'string' ? data.link : null } : { required: false, signed: true, link: null }
    setWaiver(w)
    if (!w.required || w.signed) await book(sess)
    /* the server is the one that knows: not signed yet → said so, the step stays (2026-10-04) */
    else setError(tr('booking.waiverNotYet'))
  }
  const signLink = (link: string) => {
    const back = `${window.location.origin}${window.location.pathname}?occurrence=${occurrence.id}&resume=waiver`
    return `${link}${link.includes('?') ? '&' : '?'}return=${encodeURIComponent(back)}`
  }
  const book = async (sess: string) => {
    setBusy(true); setError(null); setPhase('booking')
    /* ★ WHERE THE WAIVER SITS IS THE BUSINESS'S CHOICE, READ FROM THE SERVER (2026-10-04): when it must be signed BEFORE the booking, the
       server holds the seat (waiverHold) and answers `waiting: 'waiver'` with the link; this page shows the sign step, and the booking is
       made when the person comes back signed. Nothing about the placement is baked into the page. */
    const { ok, data } = await fn('create-booking', { businessId: BUSINESS_ID, ...(kindId ? { kindId } : {}), occurrenceId: occurrence.id, hold: true, waiverHold: true, waiverAfterPay: true, source: 'portal' }, sess)
    setBusy(false)
    const d = data as { success?: boolean; held?: boolean; already?: boolean; message?: string; error?: string; code?: string; waiting?: string; waiver?: { signed?: boolean; link?: string | null }; booking?: { id?: string }; hold?: { token?: string; expires_at?: string }; options?: HeldOptions }
    if (d.waiting === 'waiver' || d.code === 'waiver_required') { setWaiver({ required: true, signed: false, link: typeof d.waiver?.link === 'string' ? d.waiver.link : null }); setError(null); setPhase('waiver'); return }
    if (!ok || !d.success || !d.booking?.id || !d.hold?.token) { setError(d.error || tr('booking.couldNotComplete')); setPhase('who'); return }
    onHeld({ bookingId: d.booking.id, token: d.hold.token, initial: d.held ? 'pay' : 'after', expiresAt: d.hold.expires_at ?? null, options: d.options ?? null, note: d.already ? (d.message ?? null) : null })
  }



  if (phase === 'who') return (
    <div data-class-step="who" className="grid gap-4">
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <PhoneCodeStep intro={tr('booking.whoIntro')} onVerified={verified} />
    </div>
  )
  if (phase === 'waiver') return (
    <div data-class-step="waiver" className="grid gap-4">
      {me && <BookingFor me={me} />}
      {!waiver || busy ? <p className="flex items-center gap-2 text-sm text-ink-700"><Loader2 className="h-4 w-4 animate-spin" />{tr('booking.checkingWaiver')}</p> : (
        <>
          <p className="text-sm text-ink-700">{tr('booking.waiverHeld')}</p>
          <p data-waiver-once className="-mt-2 text-sm text-ink-600">{tr('booking.waiverOnce')}</p>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <div className="flex flex-wrap gap-3">
            {waiver.link && <a href={signLink(waiver.link)} data-class-action="sign" className="inline-flex h-12 items-center justify-center rounded-xl px-7 font-display text-sm font-semibold text-fam-on-dark" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>{tr('booking.waiverSign')}</a>}
            <button type="button" data-class-action="signed" onClick={() => token && void checkWaiver(token)} className="inline-flex h-12 items-center rounded-xl border px-5 text-sm font-semibold text-ink-900" style={{ borderColor: 'var(--wow-hairline)' }}>{tr('booking.waiverDone')}</button>
          </div>
        </>
      )}
    </div>
  )
  return (
    <div data-class-step="booking" className="grid gap-3">
      {me && <BookingFor me={me} />}
      <p className="flex items-center gap-2 text-sm text-ink-700"><Loader2 className="h-4 w-4 animate-spin" />{tr('booking.submitting')}</p>
    </div>
  )
}
