import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  Loader2,
  Phone,
} from 'lucide-react'
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
// A real on-page scheduler — service → date → time → details → confirmed — that
// books WITHOUT leaving the site. It mirrors the glow /book flow's proven contracts:
//   · READS the business's bookable services + weekly availability LIVE from Supabase
//     PostgREST under the PUBLIC anon key (both are anon-RLS-readable), keyed by
//     BUSINESS_ID — so owner edits to hours/services show up with no site rebuild.
//   · WRITES via the PUBLIC create-booking edge function (identical payload the glow
//     BookingPage posts), which converts the picked wall-clock time → UTC using the
//     business timezone, creates a CONFIRMED booking, advances the contact to
//     'booked', and fires the customer confirmation email.
//
// SCOPE / HONESTY (matches today's real backend behavior — see the Stage-3 gaps):
//   · SINGLE-RESOURCE. The scheduler models one calendar; correct for a SOLO operator
//     (barber, trainer, consultant). The scaffolder only enables this block for
//     clearly-solo appointment business types (site.ts BOOKING.enabled).
//   · NO conflict check. Anon cannot read the bookings table (RLS), and create-booking
//     does not overlap-check either, so slots are generated from availability + the
//     past-time filter ONLY — exactly what the glow page effectively does. Concurrent
//     double-booking is possible; server-side conflict checking is Stage-3 hardening.
//   · Renders nothing unless BOOKING.enabled. If enabled but the business has no active
//     services or no open availability, it shows an honest "call to book" fallback
//     rather than an empty/broken picker — never a dead end.
// ─────────────────────────────────────────────────────────────────────────────

interface BookableService {
  id: string
  name: string
  description: string | null
  duration_minutes: number | null
  price: number | null
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

type Step = 'service' | 'date' | 'time' | 'details' | 'confirmed'

const REST = `${SUPABASE_URL}/rest/v1`
const CREATE_BOOKING = `${SUPABASE_URL}/functions/v1/create-booking`
const ANON_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
}
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ── formatting helpers (display-only; the server owns the authoritative UTC math) ──
function formatPrice(price: number | null): string {
  if (price == null || Number.isNaN(price)) return ''
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

// Client-side slot generation — availability window walked in service-duration steps,
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
  const dur = service.duration_minutes || 60
  const now = new Date()
  const end = new Date(date)
  end.setHours(eh, em, 0, 0)
  let cur = new Date(date)
  cur.setHours(sh, sm, 0, 0)
  const slots: string[] = []
  while (cur < end) {
    const slotEnd = new Date(cur.getTime() + dur * 60000)
    if (cur >= now && slotEnd <= end) {
      slots.push(`${String(cur.getHours()).padStart(2, '0')}:${String(cur.getMinutes()).padStart(2, '0')}`)
    }
    cur = new Date(cur.getTime() + dur * 60000)
  }
  return slots
}

export function BookingWizardBlock({
  label = 'Book online',
  heading = 'Book your appointment',
  body = 'Pick a service and a time that works for you — confirmed instantly, no phone tag.',
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const reduce = useReducedMotion()
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [services, setServices] = useState<BookableService[]>([])
  const [availability, setAvailability] = useState<Availability[]>([])

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
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Load bookable services + weekly availability once, client-side (anon reads).
  useEffect(() => {
    if (!BOOKING.enabled) return
    let cancelled = false
    ;(async () => {
      try {
        const [svcRes, availRes] = await Promise.all([
          fetch(
            `${REST}/services?business_id=eq.${BUSINESS_ID}&is_active=eq.true&order=display_order,name&select=id,name,description,duration_minutes,price`,
            { headers: ANON_HEADERS },
          ),
          fetch(
            `${REST}/availability?business_id=eq.${BUSINESS_ID}&is_available=eq.true&select=day_of_week,start_time,end_time,is_available`,
            { headers: ANON_HEADERS },
          ),
        ])
        if (!svcRes.ok || !availRes.ok) throw new Error('load_failed')
        const svc = (await svcRes.json()) as BookableService[]
        const avail = (await availRes.json()) as Availability[]
        if (cancelled) return
        setServices(
          svc.map((s) => ({
            ...s,
            price: s.price == null ? null : Number(s.price),
            duration_minutes:
              s.duration_minutes == null ? null : Number(s.duration_minutes),
          })),
        )
        setAvailability(avail)
      } catch {
        if (!cancelled) setLoadError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const days = useMemo(() => bookableDays(availability), [availability])
  const slots = useMemo(
    () => (service && date ? generateSlots(service, date, availability) : []),
    [service, date, availability],
  )

  if (!BOOKING.enabled) return null

  // Honest fallback: enabled but nothing to book yet → offer the phone, never a dead end.
  const emptyConfig = !loading && !loadError && (services.length === 0 || days.length === 0)

  const submit = async () => {
    if (!service || !date || !time) return
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
          },
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean
        error?: string
      }
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'We could not complete your booking.')
      }
      setStep('confirmed')
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const STEP_ORDER: Step[] = ['service', 'date', 'time', 'details']
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
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
              {heading}
            </h2>
            {body && (
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-700">
                {body}
              </p>
            )}
          </div>

          {/* Progress rail (hidden on the confirmation + fallback states) */}
          {step !== 'confirmed' && !emptyConfig && !loadError && (
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
                <span className="text-sm font-medium">Loading availability…</span>
              </div>
            )}

            {loadError && (
              <FallbackCard message="We couldn't load online booking just now." />
            )}

            {emptyConfig && (
              <FallbackCard message="Online booking isn't set up yet — we'd love to book you by phone." />
            )}

            {!loading && !loadError && !emptyConfig && (
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
                      {time && step === 'details' && (
                        <SummaryChip
                          label={to12h(time)}
                          onClick={() => setStep('time')}
                        />
                      )}
                    </div>
                  )}

                  {/* STEP: service */}
                  {step === 'service' && (
                    <StepShell title="Choose a service">
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
                            {formatPrice(s.price) && (
                              <span className="shrink-0 font-display text-base font-semibold text-brand-700">
                                {formatPrice(s.price)}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </StepShell>
                  )}

                  {/* STEP: date */}
                  {step === 'date' && (
                    <StepShell title="Pick a day" onBack={() => setStep('service')}>
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
                    <StepShell title="Choose a time" onBack={() => setStep('date')}>
                      {slots.length === 0 ? (
                        <p className="rounded-2xl border border-dashed px-5 py-8 text-center text-sm text-ink-600" style={{ borderColor: 'var(--wow-hairline)' }}>
                          No open times left that day. Pick another day, or call us
                          at{' '}
                          <a
                            href={`tel:${SITE.phone}`}
                            className="font-semibold text-brand-700 hover:underline"
                          >
                            {SITE.phoneDisplay}
                          </a>
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
                                  setStep('details')
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

                  {/* STEP: details */}
                  {step === 'details' && (
                    <StepShell
                      title="Your details"
                      onBack={() => setStep('time')}
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
                            label="First name"
                            required
                            value={customer.firstName}
                            autoComplete="given-name"
                            onChange={(v) =>
                              setCustomer((c) => ({ ...c, firstName: v }))
                            }
                          />
                          <WField
                            label="Last name"
                            required
                            value={customer.lastName}
                            autoComplete="family-name"
                            onChange={(v) =>
                              setCustomer((c) => ({ ...c, lastName: v }))
                            }
                          />
                          <WField
                            label="Phone"
                            type="tel"
                            required
                            value={customer.phone}
                            autoComplete="tel"
                            onChange={(v) =>
                              setCustomer((c) => ({ ...c, phone: v }))
                            }
                          />
                          <WField
                            label="Email"
                            type="email"
                            value={customer.email}
                            autoComplete="email"
                            onChange={(v) =>
                              setCustomer((c) => ({ ...c, email: v }))
                            }
                          />
                        </div>
                        <label className="block">
                          <span className="font-display text-sm font-medium text-ink-900">
                            Anything we should know?
                          </span>
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
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Booking…
                              </>
                            ) : (
                              <>
                                Confirm booking
                                {date && time && (
                                  <span className="opacity-90">
                                    · {formatDateLong(date)}, {to12h(time)}
                                  </span>
                                )}
                              </>
                            )}
                          </button>
                          <span className="text-sm text-ink-600">
                            or call{' '}
                            <a
                              href={`tel:${SITE.phone}`}
                              className="font-medium text-brand-700 underline-offset-2 hover:underline"
                            >
                              {SITE.phoneDisplay}
                            </a>
                          </span>
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
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink-900">
                  You're booked in.
                </h3>
                <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-700">
                  {service.name} — {formatDateLong(date)} at {to12h(time)}.
                  {customer.email
                    ? ` A confirmation is on its way to ${customer.email}.`
                    : ` We'll see you then.`}
                </p>
                <div
                  className="mx-auto mt-6 max-w-xs rounded-2xl border bg-white p-4 text-left text-sm"
                  style={{ borderColor: 'var(--wow-hairline)' }}
                >
                  <Row Icon={Calendar} label={`${formatDateLong(date)} · ${to12h(time)}`} />
                  <Row Icon={Clock} label={formatDuration(service.duration_minutes) || service.name} />
                  {formatPrice(service.price) && (
                    <Row Icon={Check} label={formatPrice(service.price)} />
                  )}
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
            aria-label="Back"
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

function FallbackCard({ message }: { message: string }) {
  return (
    <div className="py-10 text-center">
      <p className="mx-auto max-w-md leading-relaxed text-ink-700">{message}</p>
      <a
        href={`tel:${SITE.phone}`}
        className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 font-display text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundImage: 'var(--wow-grad-brand)' }}
      >
        <Phone className="h-4 w-4" />
        Call {SITE.phoneDisplay}
      </a>
    </div>
  )
}
