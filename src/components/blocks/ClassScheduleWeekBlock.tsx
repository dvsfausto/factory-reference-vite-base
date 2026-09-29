import { useEffect, useState } from 'react'
import { Clock, Users } from 'lucide-react'
import { tr } from '~/lib/i18n'
import { classHorizon, useClassSchedule, weekSpan, type ClassHorizon, type ClassSession } from '~/lib/useClassSchedule'
import { PacksForSale } from './PacksForSale'

// Class schedule LAYOUT: 'week' (niche arc Stage 5b) — the owner's weekly timetable of group sessions: one
// column per day that has a session, each session a card with time, class, instructor, room and capacity. A
// LIVE-READ block on the booking-widget model (useClassSchedule): the dated classes (class_schedule_public) or,
// with none dated, the owner's weekly rule (class_rules, its own row, never website content: the owner's
// decision, 2026-09-29); they survive a rebuild by construction. Returns null with no sessions. Text = block
// params (label/heading/body). Nothing is invented: a session without an end time shows only its start; no
// instructor → no line; no room → no line; no capacity → no line.
//
// TOKEN DISCIPLINE: fam-* surfaces/ink/hairline/accent (DNA), rounded-* (DNA), font-display (DNA).
function fmt(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const hour = ((h! + 11) % 12) + 1
  return `${hour}:${String(m).padStart(2, '0')} ${h! < 12 ? 'am' : 'pm'}`
}

export function ClassScheduleWeekBlock({
  label,
  heading,
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const all = useClassSchedule()
  const span = weekSpan(all)
  const sessions = span.sessions
  const [beyond, setBeyond] = useState<ClassHorizon>({ days: null, nextBeyond: null, waitlist: true })
  useEffect(() => { void classHorizon().then(setBeyond) }, [])
  /* ★ a later class exists beyond the owner's window (part 3's small one): say so instead of showing nothing */
  const beyondLine = beyond.days && beyond.nextBeyond ? tr('schedule.moreLater').replace('{date}', new Date(beyond.nextBeyond).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })).replace('{days}', String(beyond.days)) : null
  if (sessions.length === 0) return beyondLine ? <section className="px-4 py-8 text-center text-sm text-ink-600" data-schedule-beyond="">{beyondLine}</section> : null
  const dayNames = [tr('day.sun'), tr('day.mon'), tr('day.tue'), tr('day.wed'), tr('day.thu'), tr('day.fri'), tr('day.sat')]
  /* ★ ONE CARD PER DAY (2026-09-29). Dated classes (the live read, the next seven days) group by DATE, in date order from
     today, so a Monday six days out sits last and the same weekday never appears twice; the weekly rule (no dates) keeps
     the Monday-first week. Only days with a session render. */
  const dated = sessions.every((s) => typeof s.date === 'string' && s.date)
  const order = [1, 2, 3, 4, 5, 6, 0]
  const groups = new Map<string, { day: number; date?: string; list: ClassSession[] }>()
  for (const s of sessions) {
    const key = dated ? s.date! : String(s.day)
    const g = groups.get(key) ?? { day: s.day, ...(dated ? { date: s.date } : {}), list: [] }
    g.list = [...g.list, s].sort((a, b) => a.start.localeCompare(b.start))
    groups.set(key, g)
  }
  const days = [...groups.values()].sort((a, b) => (dated ? a.date!.localeCompare(b.date!) : order.indexOf(a.day) - order.indexOf(b.day)))
  const dateLine = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })
  /* the week shown starts later than tomorrow → say which week, unless the owner wrote the heading */
  const today = new Date(); const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().slice(0, 10)
  const weekHeading = heading ?? (span.from && span.from > tomorrow ? tr('schedule.weekOf').replace('{date}', dateLine(span.from)) : tr('schedule.heading'))
  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label ?? tr('schedule.eyebrow')}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {weekHeading}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {days.map((g) => (
            <div key={g.date ?? g.day} className="rounded-2xl border border-fam-hairline bg-fam-surface p-5">
              <h3 className="font-display text-lg font-semibold text-fam-ink">{dayNames[g.day]}</h3>
              {g.date && <p className="mt-0.5 text-sm text-fam-ink-muted">{dateLine(g.date)}</p>}
              <ul className="mt-4 space-y-3">
                {g.list.map((s, i) => (
                  <li key={`${s.serviceName}-${s.start}-${i}`} className="rounded-xl border border-fam-hairline bg-fam-card p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-fam-accent-text-strong">
                      <Clock className="h-4 w-4" /> {fmt(s.start)}{s.end ? ` – ${fmt(s.end)}` : ''}
                    </div>
                    <div className="mt-1 font-display text-base font-semibold text-fam-ink">{s.serviceName}</div>
                    {(s.instructor || s.capacity || s.occurrenceId) && (
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fam-ink-muted">
                        {s.instructor && <span>{tr('schedule.with')} {s.instructor}</span>}
                        {s.room && <span className="text-xs">{tr('schedule.inRoom').replace('{room}', s.room)}</span>}
                        {s.occurrenceId && typeof s.seatsLeft === 'number' ? (
                          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {s.seatsLeft > 0 ? `${s.seatsLeft} ${tr('schedule.left')}` : tr('schedule.full')}</span>
                        ) : s.occurrenceId && s.isFull ? (
                          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {tr('schedule.full')}</span>
                        ) : s.capacity ? (
                          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {s.capacity} {tr('schedule.spots')}</span>
                        ) : null}
                        {/* a class is booked by its kind (2026-09-29): no kind, no link */}
                        {s.occurrenceId && s.kindId && (
                          (s.isFull || (typeof s.seatsLeft === 'number' && s.seatsLeft <= 0)) && beyond.waitlist === false
                            ? <span data-schedule-full-no-list className="font-semibold text-fam-ink-muted">{tr('schedule.full')}</span>
                            : <a href={`/book?occurrence=${s.occurrenceId}`} className="font-semibold text-fam-accent-text hover:underline">{!s.isFull && (s.seatsLeft == null || s.seatsLeft > 0) ? tr('schedule.book') : tr('schedule.waitlist')}</a>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {span.later.length > 0 && (
          <p className="mt-6 text-sm text-fam-ink-muted" data-schedule-later="">
            {span.later.map((l, i) => (
              <span key={l.serviceName}>
                {i > 0 ? ' · ' : ''}
                {tr('schedule.laterClass').replace('{name}', l.serviceName).replace('{date}', new Date(`${l.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })).replace('{time}', fmt(l.start))}
              </span>
            ))}
          </p>
        )}
        {/* ★ the packs for sale, with a Buy that works (the classes arc, 2026-09-23); nothing when the business sells none */}
        {beyondLine && <p className="mt-6 text-center text-sm text-ink-600" data-schedule-beyond="">{beyondLine}</p>}
        <PacksForSale />
      </div>
    </section>
  )
}
