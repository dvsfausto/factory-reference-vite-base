import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, BUSINESS_ID } from '~/data/site'
import { tr } from '~/lib/i18n'

/**
 * ★★★ THE SEAT IS ONLY THEIRS ONCE IT IS PAID OR SPENT (the owner, 2026-09-24).
 * After a class booking lands this takes over from the wizard: a HELD seat shows the clock and the two doors (a pack, or a
 * single class when the owner allows it), both on the business's own Stripe; back from Stripe it reads the booking until the
 * rows say confirmed; then the waiver (first time only), then the spot pick (classes with numbered spots), then done.
 * A booking confirmed at once (a credit spent) enters at the waiver or the spot. Every fact shown is read from booking-hold.
 */
export type HeldOptions = { packs: Array<{ id: string; name: string; credits: number; price: number }>; single: { amount: number; share_token: string | null; link: string } | null }
export type HeldEntry = { bookingId: string; token: string; initial: 'pay' | 'confirming' | 'after'; expiresAt?: string | null; options?: HeldOptions | null }
type Status = { status: string; held: boolean; hold_expires_at: string | null; options?: HeldOptions | null; seat_no: number | null; seats_total: number | null; occurrence: { id: string; title: string; start_at: string } | null; invoice: { amount: number; paid: boolean; share_token: string | null } | null; pack: { name: string; balance: number } | null; waiver: { signed: boolean; link: string | null } | null }
type Phase = 'pay' | 'confirming' | 'waiver' | 'spot' | 'done' | 'expired' | 'released'

const HEADERS = { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
const money = (n: number) => `$${Number(n).toFixed(2).replace(/\.00$/, '')}`

export function HeldBookingFlow({ entry, onReleased }: { entry: HeldEntry; onReleased: () => void }) {
  const [phase, setPhase] = useState<Phase>(entry.initial === 'pay' ? 'pay' : 'confirming')
  const [live, setLive] = useState<{ expiresAt: string | null; options: HeldOptions | null }>({ expiresAt: entry.expiresAt ?? null, options: entry.options ?? null })
  const cameBackWithoutPaying = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('paid') !== '1'
  const [status, setStatus] = useState<Status | null>(null)
  const [seats, setSeats] = useState<Array<{ seat_no: number; taken: boolean; mine: boolean }>>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const tries = useRef(0)

  const call = async (action: string, extra: Record<string, unknown> = {}) => {
    const r = await fetch(`${SUPABASE_URL}/functions/v1/booking-hold`, { method: 'POST', headers: HEADERS, body: JSON.stringify({ businessId: BUSINESS_ID, bookingId: entry.bookingId, token: entry.token, action, ...extra }) })
    return { ok: r.ok, data: (await r.json().catch(() => ({}))) as Record<string, unknown> }
  }
  /* where a confirmed booking goes next: the waiver first time only, then the spot when the class has numbered spots */
  const afterConfirmed = (s: Status) => {
    if (s.waiver && !s.waiver.signed && s.waiver.link) return 'waiver' as Phase
    if (s.seats_total && s.seats_total > 0) return 'spot' as Phase
    return 'done' as Phase
  }
  const readStatus = async (): Promise<Status | null> => {
    const { ok, data } = await call('status')
    if (!ok) return null
    const s = data as unknown as Status
    setStatus(s)
    return s
  }

  /* the clock on a held seat */
  useEffect(() => { if (phase !== 'pay') return; const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [phase])
  const secondsLeft = live.expiresAt ? Math.max(0, Math.floor((new Date(live.expiresAt).getTime() - now) / 1000)) : null
  useEffect(() => { if (phase === 'pay' && secondsLeft === 0) setPhase('expired') }, [phase, secondsLeft])

  /* confirming: read until the rows say confirmed (the webhook lands seconds after Stripe returns) */
  useEffect(() => {
    if (phase !== 'confirming') return
    let stop = false
    const tick = async () => {
      const s = await readStatus()
      if (stop) return
      if (!s) { if (tries.current++ < 3) setTimeout(tick, 2500); else setPhase('expired'); return }
      if (s.status === 'confirmed' || s.status === 'completed') { setPhase(afterConfirmed(s)); return }
      if (s.status === 'expired' || s.status === 'cancelled') { setPhase('expired'); return }
      /* back from Stripe's own Back link, nothing paid: the seat is still held, the doors are offered again */
      if (s.held && cameBackWithoutPaying) { setLive({ expiresAt: s.hold_expires_at, options: s.options ?? null }); setPhase('pay'); return }
      if (tries.current++ < 40) setTimeout(tick, 2500); else setPhase('expired')
    }
    void tick()
    return () => { stop = true }
  }, [phase])

  /* the spots of the class */
  useEffect(() => {
    if (phase !== 'spot') return
    void (async () => { const { data } = await call('seats'); setSeats(((data.seats as Array<{ seat_no: number; taken: boolean; mine: boolean }>) ?? [])) })()
  }, [phase])

  const buyPack = async (packId: string) => {
    setBusy(packId); setError(null)
    try {
      const returnUrl = `${window.location.origin}${window.location.pathname}?paid=1&booking=${entry.bookingId}&t=${entry.token}`
      const r = await fetch(`${SUPABASE_URL}/functions/v1/pack-checkout`, { method: 'POST', headers: HEADERS, body: JSON.stringify({ businessId: BUSINESS_ID, packId, bookingId: entry.bookingId, holdToken: entry.token, returnUrl, cancelUrl: `${window.location.origin}${window.location.pathname}?held=${entry.bookingId}&t=${entry.token}` }) })
      const d = (await r.json()) as { available?: boolean; url?: string; message?: string }
      if (d.available && d.url) { window.location.href = d.url; return }
      setError(d.message || tr('booking.couldNotComplete'))
    } catch { setError(tr('booking.couldNotComplete')) } finally { setBusy(null) }
  }
  const paySingle = async () => {
    const tokenDoc = live.options?.single?.share_token
    if (!tokenDoc) return
    setBusy('single'); setError(null)
    try {
      const returnUrl = `${window.location.origin}${window.location.pathname}?paid=1&booking=${entry.bookingId}&t=${entry.token}`
      const r = await fetch(`${SUPABASE_URL}/functions/v1/initiate-document-payment`, { method: 'POST', headers: HEADERS, body: JSON.stringify({ shareToken: tokenDoc, returnUrl, cancelUrl: `${window.location.origin}${window.location.pathname}?held=${entry.bookingId}&t=${entry.token}` }) })
      const d = (await r.json()) as { available?: boolean; checkout_url?: string; message?: string }
      if (d.available && d.checkout_url) { window.location.href = d.checkout_url; return }
      setError(d.message || tr('booking.couldNotComplete'))
    } catch { setError(tr('booking.couldNotComplete')) } finally { setBusy(null) }
  }
  const letGo = async () => { setBusy('release'); try { await call('release') } finally { setBusy(null); setPhase('released'); onReleased() } }
  const pickSeat = async (n: number) => {
    setBusy(`seat-${n}`); setError(null)
    const { ok, data } = await call('seat', { seatNo: n })
    if (!ok) { setError(String(data.error ?? tr('booking.spotTaken'))); const { data: d2 } = await call('seats'); setSeats(((d2.seats as typeof seats) ?? [])) }
    else setSeats((rows) => rows.map((r) => ({ ...r, mine: r.seat_no === n, taken: r.taken && r.seat_no !== n })))
    setBusy(null)
  }
  const mine = useMemo(() => seats.find((s) => s.mine)?.seat_no ?? status?.seat_no ?? null, [seats, status])
  const when = status?.occurrence ? new Date(status.occurrence.start_at) : null
  const whenWords = when ? when.toLocaleString(undefined, { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''

  const Card = ({ children, tag }: { children: React.ReactNode; tag: string }) => (
    <div data-held-step={tag} className="mx-auto mt-8 max-w-md rounded-2xl border bg-fam-card p-5 text-left" style={{ borderColor: 'var(--wow-hairline)' }}>{children}</div>
  )
  const Primary = ({ children, onClick, disabled, tag }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; tag?: string }) => (
    <button type="button" data-held-action={tag} disabled={disabled} onClick={onClick} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 font-display text-sm font-semibold text-fam-on-dark disabled:opacity-60" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>{children}</button>
  )

  if (phase === 'pay') {
    const o = live.options
    return (
      <Card tag="pay">
        <h3 className="font-display text-xl font-semibold text-ink-900">{tr('booking.holdTitle').replace('{m}', secondsLeft == null ? '' : `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`)}</h3>
        <p className="mt-1 text-sm text-ink-700">{tr('booking.holdBody')}</p>
        <div className="mt-4 grid gap-2">
          {(o?.packs ?? []).map((pk) => (
            <button key={pk.id} type="button" data-held-pack={pk.id} disabled={busy !== null} onClick={() => void buyPack(pk.id)} className="flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm text-ink-900" style={{ borderColor: 'var(--wow-hairline)' }}>
              <span><span className="font-semibold">{pk.name}</span> · {pk.credits} {tr('booking.classesWord')}</span>
              <span className="font-semibold">{busy === pk.id ? '…' : money(pk.price)}</span>
            </button>
          ))}
          {o?.single && o.single.share_token && (
            <button type="button" data-held-single disabled={busy !== null} onClick={() => void paySingle()} className="flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm text-ink-900" style={{ borderColor: 'var(--wow-hairline)' }}>
              <span className="font-semibold">{tr('booking.singleClass')}</span>
              <span className="font-semibold">{busy === 'single' ? '…' : money(o.single.amount)}</span>
            </button>
          )}
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="button" data-held-action="release" disabled={busy !== null} onClick={() => void letGo()} className="mt-4 text-sm text-ink-600 underline-offset-2 hover:underline">{tr('booking.letGo')}</button>
      </Card>
    )
  }
  if (phase === 'confirming') {
    return (
      <Card tag="confirming">
        <p className="flex items-center gap-2 text-sm text-ink-700"><Loader2 className="h-4 w-4 animate-spin" />{tr('booking.confirmingPay')}</p>
      </Card>
    )
  }
  if (phase === 'expired') {
    return (
      <Card tag="expired">
        <p className="text-sm text-ink-700">{tr('booking.holdExpired')}</p>
        <div className="mt-4"><Primary tag="again" onClick={onReleased}>{tr('booking.pickAgain')}</Primary></div>
      </Card>
    )
  }
  if (phase === 'released') return null
  if (phase === 'waiver') {
    return (
      <Card tag="waiver">
        <h3 className="font-display text-xl font-semibold text-ink-900">{tr('booking.seatYours')}</h3>
        <p className="mt-1 text-sm text-ink-700">{tr('booking.waiverAsk')}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={status?.waiver?.link ?? '#'} target="_blank" rel="noopener" data-held-action="sign" className="inline-flex h-11 items-center justify-center rounded-xl px-6 font-display text-sm font-semibold text-fam-on-dark" style={{ backgroundImage: 'var(--wow-grad-brand)' }}>{tr('booking.waiverSign')}</a>
          <button type="button" data-held-action="signed" onClick={() => setPhase(status && status.seats_total ? 'spot' : 'done')} className="inline-flex h-11 items-center rounded-xl border px-5 text-sm font-semibold text-ink-900" style={{ borderColor: 'var(--wow-hairline)' }}>{tr('booking.waiverDone')}</button>
        </div>
      </Card>
    )
  }
  if (phase === 'spot') {
    return (
      <Card tag="spot">
        <h3 className="font-display text-xl font-semibold text-ink-900">{tr('booking.pickSpot')}</h3>
        <p className="mt-1 text-sm text-ink-700">{mine ? tr('booking.yourSpot').replace('{n}', String(mine)) : tr('booking.spotHint')}</p>
        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {seats.map((s) => (
            <button key={s.seat_no} type="button" data-held-seat={s.seat_no} data-seat-state={s.mine ? 'mine' : s.taken ? 'taken' : 'free'} disabled={s.taken || busy !== null} onClick={() => void pickSeat(s.seat_no)}
              className={`h-11 rounded-lg border text-sm font-semibold ${s.mine ? 'text-fam-on-dark' : s.taken ? 'opacity-40 line-through' : 'text-ink-900'}`}
              style={s.mine ? { backgroundImage: 'var(--wow-grad-brand)', borderColor: 'transparent' } : { borderColor: 'var(--wow-hairline)' }}>{s.seat_no}</button>
          ))}
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-4"><Primary tag="keep" disabled={!mine} onClick={() => setPhase('done')}>{tr('booking.keepSpot')}</Primary></div>
      </Card>
    )
  }
  return (
    <div data-held-step="done" className="py-4 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full text-fam-on-dark" style={{ backgroundImage: 'var(--wow-grad-brand)' }}><Check className="h-7 w-7" /></span>
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink-900">{tr('booking.seatYours')}</h3>
      <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-700">
        {status?.occurrence ? `${status.occurrence.title}, ${whenWords}.` : ''} {mine ? tr('booking.yourSpot').replace('{n}', String(mine)) + '.' : ''} {status?.pack ? tr(status.pack.balance === 1 ? 'booking.classLeftOne' : 'booking.classesLeft').replace('{n}', String(status.pack.balance)).replace('{pack}', status.pack.name) : ''}
      </p>
    </div>
  )
}
