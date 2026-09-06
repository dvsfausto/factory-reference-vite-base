import { useEffect, useMemo, useState } from 'react'
import { tr, MONTHS_SHORT, DAYS_SHORT, LANG } from '~/lib/i18n'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { HAS_PHONE, hasPhone } from '~/lib/phone'
import {
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  Loader2,
  MapPin,
  Phone,
} from 'lucide-react'
import {
  EMPTY_ADDRESS,
  addressComplete,
  bookingLive,
  formatAddress,
  isVisit,
  priceLine,
  stepOrder,
  type BookingFeatures,
  type ServiceAddress,
} from '~/lib/booking-shape'
import {
  BOOKING,
  BUSINESS_ID,
  SITE,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from '~/data/site'

// ─────────────────────────────────────────────────────────────────────────────
// NATIVE SELF-SERVICE BOOKING WIZARD (Arc 4a · Stage 2).
//
// A real on-page scheduler, service → date → time → details → confirmed, that
// books WITHOUT leaving the site. It mirrors the glow /book flow's proven contracts:
//   · READS the business's bookable services + weekly availability LIVE from Supabase
//     PostgREST under the PUBLIC anon key (both are anon-RLS-readable), keyed by
//     BUSINESS_ID, so owner edits to hours/services show up with no site rebuild.
//   · WRITES via the PUBLIC create-booking edge function (identical payload the glow
//     BookingPage posts), which converts the picked wall-clock time → UTC using the
//     business timezone, creates a CONFIRMED booking, advances the contact to
//     'booked', and fires the customer confirmation email.
//
// SCOPE / HONESTY (matches today's real backend behavior, see the Stage-3 gaps):
//   · SINGLE-RESOURCE. The scheduler models one calendar; correct for a SOLO operator
//     (barber, trainer, consultant). The scaffolder only enables this block for
//     clearly-solo appointment business types (site.ts BOOKING.enabled).
//   · NO client-side conflict check. Anon cannot read the bookings table (RLS); slots are
//     generated from availability + the past-time filter, and create-booking is the one
//     place that refuses a full slot (per-service capacity; pooled across a visit crew).
//   · LIVE GATE. The owner's switch (website_config.features_enabled.booking) AND their
//     hours confirmation (features_enabled.hours_confirmed_at) must both be set, else the
//     wizard shows "opens soon" + the phone. Hours are SEEDED at signup for every business
//     (Mon–Fri 09:00–17:00), so an unconfirmed calendar must never take a booking.
//   · VISIT WORK (services.booking_model = 'visit': cleaners, landscapers, movers, mobile
//     detailing) happens at the customer's address: the wizard asks WHERE before the
//     details, calls the time an arrival time, and says "price confirmed on site" when
//     the service carries no price — never "$0". See ~/lib/booking-shape.ts.
//   · Renders nothing unless BOOKING.enabled. If enabled but the business has no active
//     services or no open availability, it shows an honest "call to book" fallback
//     rather than an empty/broken picker, never a dead end.
// ─────────────────────────────────────────────────────────────────────────────

interface BookableService {
  id: string
  name: string
  description: string | null
  duration_minutes: number | null
  price: number | null
  booking_model: 'slot' | 'day' | 'visit' | null
}

interface Availability {
  day_of_week: number // 0=Sun … 6=Sat
  start_time: string // "HH:MM:SS"
  end_time: string // "HH:MM:SS"
  is_available: boolean
}

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  notes: string
}

type Step = 'service' | 'date' | 'time' | 'address' | 'details' | 'confirmed'

const REST = `${SUPABASE_URL}/rest/v1`
const CREATE_BOOKING = `${SUPABASE_URL}/functions/v1/create-booking`
const ANON_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
}
const DAY_LABELS = DAYS_SHORT[LANG]
const MONTHS = MONTHS_SHORT[LANG]

// ── formatting helpers (display-only; the server owns the authoritative UTC math) ──
function formatPrice(price: number | null): string {
  // Hide unset/zero prices (barber "Haircut" often has price 0 = not-priced) rather
  // than showing a misleading "$0"; a real charge (e.g. $20 Facial) still renders.
  if (price == null || Number.isNaN(price) || price <= 0) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price)
}

function formatDuration(min: number | null): string {
  if (!min) return ''
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} hr ${m} min` : `${h} hr`
}

// "HH:MM" 24h → "2:30 PM"
function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const ap = h < 12 ? 'AM' : 'PM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`
}

function formatDateLong(d: Date): string {
  return `${DAY_LABELS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`
}

// The next bookable calendar days: not past, and on a weekday the business is open.
// Mirrors the glow DateSelector window (up to 30 days out); capped for a tidy grid.
function bookableDays(availability: Availability[], limit = 14): Date[] {
  const openDows = new Set(
    availability.filter((a) => a.is_available).map((a) => a.day_of_week),
  )
  if (openDows.size === 0) return []
  const out: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i < 30 && out.length < limit; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (openDows.has(d.getDay())) out.push(d)
  }
  return out
}

// Client-side slot generation, availability window walked in service-duration steps,
// past slots dropped. NO conflict subtraction (anon can't read bookings; see header).
function generateSlots(
  service: BookableService,
  date: Date,
  availability: Availability[],
): string[] {
  const avail = availability.find(
    (a) => a.day_of_week === date.getDay() && a.is_available,
  )
  if (!avail) return []
  const [sh, sm] = avail.start_time.split(':').map(Number)
  const [eh, em] = avail.end_time.split(':').map(Number)
  /**
   * ═══════════════════════════════════════════════════════════════════════════════
   * ★★★ A HANG IS WORSE THAN AN ERROR — this loop walks the availability window in
   * service-duration steps, so the step IS the termination condition.
   *
   * ⚠️ `duration_minutes || 60` LOOKS LIKE A GUARD AND IS NOT ONE. It catches 0, null and NaN
   * because all three are falsy — but a NEGATIVE duration passes straight through, `cur` then walks
   * BACKWARDS, `cur < end` is true forever, and the customer's browser locks up on the one page
   * whose whole job is to take their money. A fractional duration terminates but spins hundreds of
   * thousands of times first, which the visitor experiences as the same thing.
   *
   * ★ SO: A POSITIVE FINITE NUMBER, OR THE DEFAULT — and independently of that, a hard ceiling on
   * iterations, because the guard reasons about the value while the ceiling reasons about the loop.
   * A future bad value that slips the first cannot get past the second.
   *
   * ⚠️ THIS RUNS ON EVERY GENERATED CUSTOMER SITE, where there is no dashboard to escape to and no
   * one to report it. The identical guard already exists in glow's TimeSelector; this is the copy
   * that was missed. Today 229 of 323 active services have a null duration and none is negative —
   * so this is one bad row away rather than currently broken, and the fix costs nothing.
   * ═══════════════════════════════════════════════════════════════════════════════
   */
  const rawDur = service.duration_minutes
  const dur =
    typeof rawDur === 'number' && Number.isFinite(rawDur) && rawDur > 0 ? rawDur : 60
  const now = new Date()
  const end = new Date(date)
  end.setHours(eh, em, 0, 0)
  let cur = new Date(date)
  cur.setHours(sh, sm, 0, 0)
  /* An Invalid Date from a malformed availability row makes every comparison false, so the loop
     never runs and the day simply shows no slots. Bailing explicitly says that out loud. */
  if (Number.isNaN(cur.getTime()) || Number.isNaN(end.getTime())) return []
  /* At most one slot per minute of the window, +1 for the boundary. */
  const maxIterations = Math.max(1, Math.ceil((end.getTime() - cur.getTime()) / 60000)) + 1
  let iterations = 0
  const slots: string[] = []
  while (cur < end && iterations < maxIterations) {
    iterations++
    const slotEnd = new Date(cur.getTime() + dur * 60000)
    if (cur >= now && slotEnd <= end) {
      slots.push(`${String(cur.getHours()).padStart(2, '0')}:${String(cur.getMinutes()).padStart(2, '0')}`)
    }
    cur = new Date(cur.getTime() + dur * 60000)
  }
  return slots
}

export function BookingWizardBlock({
  site = SITE,
  label = tr('booking.bookOnline'),
  heading = tr('booking.bookYourAppointment'),
  headingLevel = 2,
  body = tr('booking.bookBody'),
  forceEnabled = false,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  /** 1 when this block is the page title (a custom page whose layout has no `intro` block). */
  headingLevel?: 1 | 2
  body?: string
  // Render the wizard even when BOOKING.enabled is false. BOOKING.enabled gates the
  // AUTO-SPLICED homepage section (solo-typed builds); the dedicated /book customPage
  // places this block EXPLICITLY (params.forceEnabled), so it must render there for any
  // affordance-eligible business regardless of the homepage-section heuristic. Same live
  // reads, same create-booking write, same honest fallback, only the gate differs.
  forceEnabled?: boolean
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  const enabled = BOOKING.enabled || forceEnabled
  const reduce = useReducedMotion()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [services, setServices] = useState<BookableService[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])
  // null = the business has no website_config row (→ not live); undefined = not loaded yet.
  const [features, setFeatures] = useState<BookingFeatures | null | undefined>(undefined)

  const [step, setStep] = useState<Step>('service')
  const [service, setService] = useState<BookableService | null>(null)
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [customer, setCustomer] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [address, setAddress] = useState<ServiceAddress>({
    ...EMPTY_ADDRESS,
    state: (site as { address?: { state?: string } }).address?.state ?? '',
  })
  const [addressError, setAddressError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Load bookable services + weekly availability once, client-side (anon reads).
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    ;(async () => {
      try {
        const [svcRes, availRes, cfgRes] = await Promise.all([
          fetch(
            `${REST}/services?business_id=eq.${BUSINESS_ID}&is_active=eq.true&bookable=eq.true&order=display_order,name&select=id,name,description,duration_minutes,price,booking_model`,
            { headers: ANON_HEADERS },
          ),
          fetch(
            `${REST}/availability?business_id=eq.${BUSINESS_ID}&is_available=eq.true&select=day_of_week,start_time,end_time,is_available`,
            { headers: ANON_HEADERS },
          ),
          fetch(
            `${REST}/website_config?business_id=eq.${BUSINESS_ID}&select=features_enabled`,
            { headers: ANON_HEADERS },
          ),
        ])
        if (!svcRes.ok || !availRes.ok || !cfgRes.ok) throw new Error('load_failed')
        const svc = (await svcRes.json()) as BookableService[]
        const avail = (await availRes.json()) as Availability[]
        const cfg = (await cfgRes.json()) as Array<{ features_enabled: BookingFeatures | null }>
        if (cancelled) return
        setFeatures(cfg[0]?.features_enabled ?? null)
        setServices(
          svc.map((s) => ({
            ...s,
            price: s.price == null ? null : Number(s.price),
            duration_minutes:
              s.duration_minutes == null ? null : Number(s.duration_minutes),
          })),
        )
        setAvailability(avail)
        // /book?service=<id> (a service page's own "Book now"): land on that service's calendar.
        const pre =
          typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('service') : null
        const hit = pre ? svc.find((s) => s.id === pre) : undefined
        if (hit) {
          setService({
            ...hit,
            price: hit.price == null ? null : Number(hit.price),
            duration_minutes: hit.duration_minutes == null ? null : Number(hit.duration_minutes),
          })
          setStep('date')
        }
      } catch {
        if (!cancelled) setLoadError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [enabled])

  const days = useMemo(() => bookableDays(availability), [availability])
  const slots = useMemo(
    () => (service && date ? generateSlots(service, date, availability) : []),
    [service, date, availability],
  )

  if (!enabled) return null

  // The owner's switch + hours confirmation. Not live → "opens soon" + the phone.
  const gate = bookingLive(features)
  const notLive = !loading && !loadError && !gate.live
  // Honest fallback: live but nothing to book yet → offer the phone, never a dead end.
  const emptyConfig =
    !loading && !loadError && gate.live && (services.length === 0 || days.length === 0)
  const visit = isVisit(service)

  const submit = async () => {
    if (!service || !date || !time) return
    if (visit && !addressComplete(address)) {
      setAddressError(tr('booking.errAddress'))
      setStep('address')
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch(CREATE_BOOKING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...ANON_HEADERS },
        body: JSON.stringify({
          businessId: BUSINESS_ID,
          serviceId: service.id,
          selectedDate: date.toISOString(),
          selectedTime: time,
          customerInfo: {
            firstName: customer.firstName.trim(),
            lastName: customer.lastName.trim(),
            email: customer.email.trim(),
            phone: customer.phone.trim(),
            notes: customer.notes.trim(),
            ...(visit
              ? {
                  address: {
                    line1: address.line1.trim(),
                    line2: address.line2.trim(),
                    city: address.city.trim(),
                    state: address.state.trim(),
                    zip: address.zip.trim(),
                  },
                }
              : {}),
          },
          serviceLocation: visit ? 'customer_address' : 'business',
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean
        error?: string
      }
      if (!res.ok || !data.success) {
        throw new Error(data.error || tr('booking.couldNotComplete'))
      }
      setStep('confirmed')
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : tr('booking.retry'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const STEP_ORDER: Step[] = stepOrder(visit)
  const stepIndex = STEP_ORDER.indexOf(step)

  return (
    <section
      id="book"
      className="relative overflow-hidden scroll-mt-24"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundImage: 'var(--wow-grad-brand)' }}
              />
              {label}
            </span>
            <Heading className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
              {heading}
            </Heading>
            {body && (
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-700">
                {body}
              </p>
            )}
          </div>

          {/* Progress rail (hidden on the confirmation + fallback states) */}
          {step !== 'confirmed' && !emptyConfig && !notLive && !loadError && (
            <div className="mx-auto mt-10 flex max-w-md items-center gap-2">
              {STEP_ORDER.map((s, i) => (
                <div key={s} className="flex flex-1 items-center gap-2">
                  <div
                    className="h-1.5 flex-1 rounded-full transition-colors duration-500"
                    style={{
                      backgroundImage:
                        i <= stepIndex ? 'var(--wow-grad-brand)' : undefined,
                      backgroundColor:
                        i <= stepIndex ? undefined : 'var(--wow-hairline)',
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-8 overflow-hidden rounded-[1.5rem] border bg-white/85 p-6 backdrop-blur-md sm:p-8 md:p-10"
            style={{
              borderColor: 'var(--wow-hairline)',
              boxShadow: 'var(--wow-shadow-lift)',
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1"
              style={{ backgroundImage: 'var(--wow-grad-brand)' }}
            />

            {loading && (
              <div className="flex items-center justify-center gap-3 py-16 text-ink-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">{tr('booking.loadingAvailability')}</span>
              </div>
            )}

            {loadError && (
              <FallbackCard message={tr('booking.couldNotLoad')} />
            )}

            {notLive && (
              <div data-booking-gate={gate.reason}>
                <FallbackCard message={tr(HAS_PHONE ? 'booking.notOpenYet' : 'booking.notOpenYetNoPhone')} features={features} />
              </div>
            )}

            {emptyConfig && (
              <FallbackCard message={tr(HAS_PHONE ? 'booking.fallback' : 'booking.fallbackNoPhone')} features={features} />
            )}

            {!loading && !loadError && !notLive && !emptyConfig && (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={reduce ? false : { opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: -12 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Selection summary breadcrumb */}
                  {step !== 'service' && step !== 'confirmed' && (
                    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
                      <SummaryChip
                        label={service?.name}
                        onClick={() => setStep('service')}
                      />
                      {date && step !== 'date' && (
                        <SummaryChip
                          label={formatDateLong(date)}
                          onClick={() => setStep('date')}
                        />
                      )}
                      {time && (step === 'details' || step === 'address') && (
                        <SummaryChip
                          label={to12h(time)}
                          onClick={() => setStep('time')}
                        />
                      )}
                      {visit && step === 'details' && addressComplete(address) && (
                        <SummaryChip
                          label={formatAddress(address)}
                          onClick={() => setStep('address')}
                        />
                      )}
                    </div>
                  )}

                  {/* STEP: service */}
                  {step === 'service' && (
                    <StepShell title={tr('booking.chooseService')}>
                      <div className="grid gap-3">
                        {services.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setService(s)
                              setTime(null)
                              setStep('date')
                            }}
                            className="group flex items-center justify-between gap-4 rounded-2xl border bg-white px-5 py-4 text-left transition-all hover:-translate-y-0.5"
                            style={{ borderColor: 'var(--wow-hairline)' }}
                          >
                            <span>
                              <span className="block font-display text-base font-semibold text-ink-900">
                                {s.name}
                              </span>
                              <span className="mt-0.5 flex items-center gap-2 text-sm text-ink-600">
                                {formatDuration(s.duration_minutes) && (
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {formatDuration(s.duration_minutes)}
                                  </span>
                                )}
                              </span>
                            </span>
                            {(() => {
                              const pl = priceLine(s, formatPrice)
                              if (pl.kind === 'amount')
                                return (
                                  <span className="shrink-0 font-display text-base font-semibold text-brand-700">
                                    {pl.text}
                                  </span>
                                )
                              if (pl.kind === 'on_site')
                                return (
                                  <span className="shrink-0 text-sm text-ink-600">
                                    {tr('booking.priceOnSite')}
                                  </span>
                                )
                              return null
                            })()}
                          </button>
                        ))}
                      </div>
                    </StepShell>
                  )}

                  {/* STEP: date */}
                  {step === 'date' && (
                    <StepShell title={tr('booking.pickDay')} onBack={() => setStep('service')}>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {days.map((d) => {
                          const selected =
                            date?.toDateString() === d.toDateString()
                          return (
                            <button
                              key={d.toISOString()}
                              type="button"
                              onClick={() => {
                                setDate(d)
                                setTime(null)
                                setStep('time')
                              }}
                              className="flex flex-col items-center rounded-2xl border px-3 py-3.5 transition-all hover:-translate-y-0.5"
                              style={
                                selected
                                  ? {
                                      backgroundImage: 'var(--wow-grad-brand)',
                                      borderColor: 'transparent',
                                      color: 'white',
                                    }
                                  : { borderColor: 'var(--wow-hairline)' }
                              }
                            >
                              <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                                {DAY_LABELS[d.getDay()]}
                              </span>
                              <span className="mt-0.5 font-display text-lg font-semibold">
                                {d.getDate()}
                              </span>
                              <span className="text-xs opacity-80">
                                {MONTHS[d.getMonth()]}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </StepShell>
                  )}

                  {/* STEP: time */}
                  {step === 'time' && (
                    <StepShell
                      title={visit ? tr('booking.arrivalTime') : tr('booking.chooseTime')}
                      onBack={() => setStep('date')}
                    >
                      {slots.length === 0 ? (
                        <p className="rounded-2xl border border-dashed px-5 py-8 text-center text-sm text-ink-600" style={{ borderColor: 'var(--wow-hairline)' }}>
                          {tr('booking.noOpenTimes')}
                          {hasPhone(site.phone) && (<>
                            {' '}at{' '}
                            <a
                              href={`tel:${site.phone}`}
                              className="font-semibold text-brand-700 hover:underline"
                            >
                              {site.phoneDisplay}
                            </a>
                          </>)}
                          .
                        </p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                          {slots.map((s) => {
                            const selected = time === s
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  setTime(s)
                                  setStep(visit ? 'address' : 'details')
                                }}
                                className="rounded-xl border px-3 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5"
                                style={
                                  selected
                                    ? {
                                        backgroundImage: 'var(--wow-grad-brand)',
                                        borderColor: 'transparent',
                                        color: 'white',
                                      }
                                    : { borderColor: 'var(--wow-hairline)' }
                                }
                              >
                                {to12h(s)}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </StepShell>
                  )}

                  {/* STEP: address (visit work only — where the crew should come) */}
                  {step === 'address' && (
                    <StepShell
                      title={tr('booking.whereShouldWeCome')}
                      onBack={() => setStep('time')}
                    >
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (!addressComplete(address)) {
                            setAddressError(tr('booking.errAddress'))
                            return
                          }
                          setAddressError(null)
                          setStep('details')
                        }}
                        className="grid gap-4"
                        data-booking-step="address"
                      >
                        <WField
                          label={tr('form.addressLine1')}
                          required
                          value={address.line1}
                          autoComplete="address-line1"
                          onChange={(v) => setAddress((a) => ({ ...a, line1: v }))}
                        />
                        <WField
                          label={tr('form.addressLine2')}
                          value={address.line2}
                          autoComplete="address-line2"
                          onChange={(v) => setAddress((a) => ({ ...a, line2: v }))}
                        />
                        <div className="grid gap-4 sm:grid-cols-3">
                          <WField
                            label={tr('form.city')}
                            required
                            value={address.city}
                            autoComplete="address-level2"
                            onChange={(v) => setAddress((a) => ({ ...a, city: v }))}
                          />
                          <WField
                            label={tr('form.state')}
                            value={address.state}
                            autoComplete="address-level1"
                            onChange={(v) => setAddress((a) => ({ ...a, state: v }))}
                          />
                          <WField
                            label={tr('form.zip')}
                            required
                            value={address.zip}
                            autoComplete="postal-code"
                            onChange={(v) => setAddress((a) => ({ ...a, zip: v }))}
                          />
                        </div>
                        {addressError && (
                          <p role="alert" className="text-sm text-red-600">
                            {addressError}
                          </p>
                        )}
                        <div className="mt-2">
                          <button
                            type="submit"
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
                            style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                          >
                            {tr('booking.continue')}
                          </button>
                        </div>
                      </form>
                    </StepShell>
                  )}

                  {/* STEP: details */}
                  {step === 'details' && (
                    <StepShell
                      title={tr('booking.yourDetails')}
                      onBack={() => setStep(visit ? 'address' : 'time')}
                    >
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          submit()
                        }}
                        className="grid gap-4"
                      >
                        <div className="grid gap-4 sm:grid-cols-2">
                          <WField
                            label={tr('form.firstName')}
                            required
                            value={customer.firstName}
                            autoComplete="given-name"
                            onChange={(v) =>
                              setCustomer((c) => ({ ...c, firstName: v }))
                            }
                          />
                          <WField
                            label={tr('form.lastName')}
                            required
                            value={customer.lastName}
                            autoComplete="family-name"
                            onChange={(v) =>
                              setCustomer((c) => ({ ...c, lastName: v }))
                            }
                          />
                          <WField
                            label={tr('form.phone')}
                            type="tel"
                            required
                            value={customer.phone}
                            autoComplete="tel"
                            onChange={(v) =>
                              setCustomer((c) => ({ ...c, phone: v }))
                            }
                          />
                          <WField
                            label={tr('form.email')}
                            type="email"
                            value={customer.email}
                            autoComplete="email"
                            onChange={(v) =>
                              setCustomer((c) => ({ ...c, email: v }))
                            }
                          />
                        </div>
                        <label className="block">
                          <span className="font-display text-sm font-medium text-ink-900">{tr('booking.anythingToKnow')}</span>
                          <textarea
                            rows={3}
                            value={customer.notes}
                            onChange={(e) =>
                              setCustomer((c) => ({
                                ...c,
                                notes: e.target.value,
                              }))
                            }
                            className="mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-base text-ink-900 outline-none transition-colors focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
                            style={{ borderColor: 'var(--wow-hairline)' }}
                          />
                        </label>

                        {submitError && (
                          <p role="alert" className="text-sm text-red-600">
                            {submitError}
                          </p>
                        )}

                        <div className="mt-2 flex flex-wrap items-center gap-4">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                            style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />{tr('booking.submitting')}</>
                            ) : (
                              <>
                                {tr('booking.confirmBooking')}
                                {date && time && (
                                  <span className="opacity-90">
                                    · {formatDateLong(date)}, {to12h(time)}
                                  </span>
                                )}
                              </>
                            )}
                          </button>
                          {hasPhone(site.phone) && (<span className="text-sm text-ink-600">
                            or call{' '}
                            <a
                              href={`tel:${site.phone}`}
                              className="font-medium text-brand-700 underline-offset-2 hover:underline"
                            >
                              {site.phoneDisplay}
                            </a>
                          </span>)}
                        </div>
                      </form>
                    </StepShell>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* STEP: confirmed (outside AnimatePresence so it persists) */}
            {step === 'confirmed' && service && date && time && (
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="py-4 text-center"
              >
                <span
                  className="mx-auto grid h-14 w-14 place-items-center rounded-full text-white"
                  style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                >
                  <Check className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink-900">{tr('booking.confirmed')}</h3>
                <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-700">
                  {service.name}, {formatDateLong(date)} {tr('booking.at')} {to12h(time)}.
                  {customer.email
                    ? ` ${tr('booking.confirmationTo')} ${customer.email}.`
                    : ` ${tr('booking.seeYouThen')}`}
                </p>
                <div
                  className="mx-auto mt-6 max-w-xs rounded-2xl border bg-white p-4 text-left text-sm"
                  style={{ borderColor: 'var(--wow-hairline)' }}
                >
                  <Row Icon={Calendar} label={`${formatDateLong(date)} · ${to12h(time)}`} />
                  <Row Icon={Clock} label={formatDuration(service.duration_minutes) || service.name} />
                  {visit && (
                    <Row Icon={MapPin} label={formatAddress(address) || tr('booking.atYourAddress')} />
                  )}
                  {(() => {
                    const pl = priceLine(service, formatPrice)
                    if (pl.kind === 'amount') return <Row Icon={Check} label={pl.text} />
                    if (pl.kind === 'on_site') return <Row Icon={Check} label={tr('booking.priceOnSite')} />
                    return null
                  })()}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function StepShell({
  title,
  onBack,
  children,
}: {
  title: string
  onBack?: () => void
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label={tr('booking.back')}
            className="grid h-8 w-8 place-items-center rounded-full border text-ink-700 transition-colors hover:text-brand-700"
            style={{ borderColor: 'var(--wow-hairline)' }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <h3 className="font-display text-xl font-semibold text-ink-900">
          {title}
        </h3>
      </div>
      {children}
    </div>
  )
}

function SummaryChip({
  label,
  onClick,
}: {
  label?: string
  onClick: () => void
}) {
  if (!label) return null
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border bg-white px-3 py-1 font-medium text-ink-700 transition-colors hover:text-brand-700"
      style={{ borderColor: 'var(--wow-hairline)' }}
    >
      {label}
    </button>
  )
}

function WField({
  label,
  value,
  onChange,
  type = 'text',
  required,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <label className="block">
      <span className="font-display text-sm font-medium text-ink-900">
        {label} {required && <span className="text-brand-700">*</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-base text-ink-900 outline-none transition-colors focus:border-brand-600 focus:ring-1 focus:ring-brand-600"
        style={{ borderColor: 'var(--wow-hairline)' }}
      />
    </label>
  )
}

function Row({
  Icon,
  label,
}: {
  Icon: typeof Calendar
  label: string
}) {
  return (
    <div className="flex items-center gap-2.5 py-1 text-ink-800">
      <Icon className="h-4 w-4 shrink-0 text-brand-700" />
      <span className="font-medium">{label}</span>
    </div>
  )
}

/**
 * ★ NEVER A DEAD END (2026-09-06). With a phone, the fallback offers the call. WITHOUT one it must not say
 * "call us" — a live site did, with no number anywhere. It says what is true and offers the path that
 * exists: the hosted quote request when the config carries one, else the site's own contact page.
 */
function FallbackCard({ message, features }: { message: string; features?: BookingFeatures | null }) {
  const quoteUrl = (features as { quote_url?: unknown } | null | undefined)?.quote_url
  const quoteHref = typeof quoteUrl === 'string' && /^https?:\/\//.test(quoteUrl) ? quoteUrl : null
  return (
    <div className="py-10 text-center">
      <p className="mx-auto max-w-md leading-relaxed text-ink-700">{message}</p>
      {!HAS_PHONE && (
        <a
          href={quoteHref ?? '/contact'}
          data-booking-fallback={quoteHref ? 'quote' : 'contact'}
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundImage: 'var(--wow-grad-brand)' }}
        >
          {quoteHref ? tr('booking.requestQuote') : tr('booking.sendMessage')}
        </a>
      )}
      {HAS_PHONE && (<a
        href={`tel:${SITE.phone}`}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundImage: 'var(--wow-grad-brand)' }}
      >
        <Phone className="h-4 w-4" />
        Call {SITE.phoneDisplay}
      </a>)}
    </div>
  )
}
