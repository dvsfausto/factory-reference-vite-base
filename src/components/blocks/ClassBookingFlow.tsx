import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, BUSINESS_ID } from '~/data/site'
import { tr } from '~/lib/i18n'
import { RoomMap, markSpotChosen, type HeldEntry, type HeldOptions, type Room, type SeatCell } from '~/components/blocks/HeldBookingFlow'
import { PhoneCodeStep, BookingFor, restoreVerified, type Verified } from '~/components/blocks/PhoneCodeStep'

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
 * ★ ZB-349 (the owner, 2026-10-18): THE SPOT FIRST, for everyone. A class in a room shows the room and its free spots BEFORE the number
 *   and the code; the chosen number goes to create-booking as seatNo, which holds exactly that spot (take_seat) or answers seat_taken,
 *   and the room comes back with the spot gone. After the payment there is no second pick (markSpotChosen). A class with no room is
 *   unchanged. The free spots are read from the public views (class_schedule_public, occurrence_seats_public, rooms_public).
 */
type Phase = 'loading' | 'spot' | 'who' | 'waiver' | 'booking'
const HEADERS = { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
import { readSession, clearSession } from '~/lib/portal-session'

/* a class is booked by its KIND (the owner, 2026-09-29): kindId, never a service id */
export function ClassBookingFlow({ occurrence, kindId, onHeld, onVerified }: { occurrence: { id: string; title: string }; kindId: string | null; onHeld: (entry: HeldEntry) => void; onVerified?: (v: Verified) => void }) {
  const [phase, setPhase] = useState<Phase>('loading')
  /* ★ ZB-349: the room, its spots and the one picked before sign-in */
  const [room, setRoom] = useState<Room | null>(null)
  const [seats, setSeats] = useState<SeatCell[]>([])
  const [chosen, setChosenState] = useState<number | null>(null)
  const chosenRef = useRef<number | null>(null)
  const setChosen = (n: number | null) => { chosenRef.current = n; setChosenState(n) }
  const [spotKind, setSpotKind] = useState<string | null>(null)
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
  const rest = async <T,>(path: string): Promise<T[]> => {
    try { const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers: HEADERS }); return r.ok ? ((await r.json()) as T[]) : [] } catch { return [] }
  }
  /* ★ ZB-349: the class's own room (never the business's default) and which of its spots are free right now */
  const loadSpots = async (): Promise<boolean> => {
    /* the room decides; the count may be hidden by the owner (show_spots_left off nulls seats_total in the view), the spot rows are not */
    const [c] = await rest<{ room_key: string | null }>(`class_schedule_public?id=eq.${occurrence.id}&select=room_key`)
    if (!c?.room_key) return false
    const [rows, rm] = await Promise.all([
      rest<{ seat_no: number; taken: boolean }>(`occurrence_seats_public?occurrence_id=eq.${occurrence.id}&select=seat_no,taken&order=seat_no`),
      rest<Room & { room_key: string }>(`rooms_public?business_id=eq.${BUSINESS_ID}&room_key=eq.${encodeURIComponent(c.room_key)}&select=name,front,rows,spot_kind,room_key`),
    ])
    if (!rows.length) return false
    setSeats(rows.map((r) => ({ seat_no: r.seat_no, taken: r.taken, mine: false })))
    if (rm[0] && Array.isArray(rm[0].rows) && rm[0].rows.length) { setRoom(rm[0]); setSpotKind(rm[0].spot_kind ?? null) }
    return true
  }
  /* the spot first (a class in a room), then who they are: a session from the last half hour skips the code */
  useEffect(() => {
    void (async () => {
      const skip = await alreadyIn(readSession())
      const inRoom = skip ? false : await loadSpots()
      if (inRoom) { setPhase('spot'); return }
      afterSpot(null)
    })()
  }, [])
  /* ★ ZB-349: no spot pick for a rider back from signing (resume=waiver) or already booked or holding a spot on this class; the
     booking they have keeps its spot (portal-read names each booking's class) */
  const alreadyIn = async (sess: string | null): Promise<boolean> => {
    try { if (new URLSearchParams(window.location.search).get('resume') === 'waiver') return true } catch { /* no address */ }
    if (!sess) return false
    const { ok, data } = await fn('portal-read', { businessId: BUSINESS_ID }, sess)
    if (!ok) return false
    const mine = [...((data.bookings ?? []) as Array<{ occurrenceId?: string | null; status?: string }>).filter((b) => ['pending', 'confirmed'].includes(String(b.status))), ...((data.held ?? []) as Array<{ occurrenceId?: string | null }>)]
    return mine.some((b) => b.occurrenceId === occurrence.id)
  }

  const afterSpot = (n: number | null) => {
    const sess = readSession()
    if (!sess) { setPhase('who'); return }
    setToken(sess)
    void restoreVerified().then((v) => { if (v) { setMe(v); onVerified?.(v) } })
    void book(sess, n)   // the same visit: no second code, straight to the class
  }
  const pickSpot = (n: number) => { setChosen(n); setError(null); setSeats((rows) => rows.map((r) => ({ ...r, mine: r.seat_no === n }))) }
  const verified = (v: Verified) => {
    setMe(v); setToken(v.token); onVerified?.(v)
    void book(v.token)
  }
  const checkWaiver = async (sess: string) => {
    setBusy(true); setError(null); setPhase('waiver')
    const { ok, status, data } = await fn('portal-waiver', { businessId: BUSINESS_ID }, sess)
    setBusy(false)
    if (status === 401) { clearSession(); setToken(null); setPhase('who'); return }
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
  const book = async (sess: string, spot: number | null = chosenRef.current) => {
    setBusy(true); setError(null); setPhase('booking')
    /* ★ WHERE THE WAIVER SITS IS THE BUSINESS'S CHOICE, READ FROM THE SERVER (2026-10-04): when it must be signed BEFORE the booking, the
       server holds the seat (waiverHold) and answers `waiting: 'waiver'` with the link; this page shows the sign step, and the booking is
       made when the person comes back signed. Nothing about the placement is baked into the page. */
    const { ok, data } = await fn('create-booking', { businessId: BUSINESS_ID, ...(kindId ? { kindId } : {}), occurrenceId: occurrence.id, ...(spot ? { seatNo: spot } : {}), hold: true, waiverHold: true, waiverAfterPay: true, source: 'portal' }, sess)
    setBusy(false)
    const d = data as { success?: boolean; held?: boolean; already?: boolean; message?: string; error?: string; code?: string; waiting?: string; waiver?: { signed?: boolean; link?: string | null }; booking?: { id?: string }; hold?: { token?: string; expires_at?: string }; options?: HeldOptions }
    if (d.waiting === 'waiver' || d.code === 'waiver_required') { setWaiver({ required: true, signed: false, link: typeof d.waiver?.link === 'string' ? d.waiver.link : null }); setError(null); setPhase('waiver'); return }
    /* ★ ZB-349: the spot went to someone else between the pick and the sign-in: the room again, without it */
    if (spot && (d.code === 'seat_taken' || d.code === 'seat_failed' || d.code === 'class_full')) {
      setChosen(null); await loadSpots(); setError(tr(spotKind === 'bike' ? 'booking.bikeTaken' : 'booking.spotTaken')); setPhase('spot'); return
    }
    /* a session that ran out (30 minutes) is let go, so the code is asked again instead of failing the same way */
    if (!ok || !d.success || !d.booking?.id || !d.hold?.token) {
      /* only a sign-in that ran out asks for the number again (the server's codes; the old crash text until the server fix is live) */
      const expired = d.code === 'session_expired' || d.code === 'details_required' || d.code === 'contact_not_allowed' || /reading 'phone'/.test(String(d.error ?? ''))
      if (expired) { clearSession(); setToken(null) }
      setError(expired ? tr('booking.signInAgain') : (d.error || tr('booking.couldNotComplete'))); setPhase('who'); return
    }
    if (spot) markSpotChosen(d.booking.id)
    onHeld({ bookingId: d.booking.id, token: d.hold.token, initial: d.held ? 'pay' : 'after', expiresAt: d.hold.expires_at ?? null, options: d.options ?? null, note: d.already ? (d.message ?? null) : null })
  }



  if (phase === 'loading') return (
    <div data-class-step="loading" className="grid gap-3"><p className="flex items-center gap-2 text-sm text-ink-700"><Loader2 className="h-4 w-4 animate-spin" />{tr('booking.loadingSpots')}</p></div>
  )
  if (phase === 'spot') {
    const bike = spotKind === 'bike'
    return (
      <div data-class-step="spot" className="grid gap-3">
        <h3 className="font-display text-xl font-semibold text-ink-900">{tr(bike ? 'booking.pickBike' : 'booking.pickSpot')}</h3>
        <p className="text-sm text-ink-700">{chosen ? tr(bike ? 'booking.yourBike' : 'booking.yourSpot').replace('{n}', String(chosen)) : tr('booking.spotHint')}</p>
        {error && <p role="alert" data-spot-error className="text-sm text-red-600">{error}</p>}
        <RoomMap room={room} seats={seats} busy={busy} onPick={pickSpot} />
        <div className="mt-2"><button type="button" data-class-action="spot-continue" disabled={!chosen || busy} onClick={() => afterSpot(chosen)} className="inline-flex h-12 items-center justify-center rounded-xl px-7 font-display text-sm font-semibold text-fam-on-dark disabled:opacity-50" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>{tr('booking.spotContinue')}</button></div>
      </div>
    )
  }
  if (phase === 'who') return (
    <div data-class-step="who" className="grid gap-4">
      {chosen && <p data-spot-chosen={chosen} className="text-sm text-ink-700">{tr(spotKind === 'bike' ? 'booking.yourBike' : 'booking.yourSpot').replace('{n}', String(chosen))}</p>}
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
