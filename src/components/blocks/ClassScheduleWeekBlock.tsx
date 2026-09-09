import { Clock, Users } from 'lucide-react'
import { tr } from '~/lib/i18n'
import { useClassSchedule, type ClassSession } from '~/lib/useClassSchedule'

// Class schedule LAYOUT: 'week' (niche arc Stage 5b) — the owner's weekly timetable of group sessions: one
// column per day that has a session, each session a card with time, class, instructor and capacity. A
// LIVE-READ block on the booking-widget model (useClassSchedule): the sessions are site_content_items rows the
// owner edits in the dashboard or through the assistant; they survive a rebuild by construction. Returns
// null with no sessions. Text = block params (label/heading/body). Nothing is invented: a session without an
// end time shows only its start; no instructor → no line; no capacity → no line.
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
  const sessions = useClassSchedule()
  if (sessions.length === 0) return null
  const dayNames = [tr('day.sun'), tr('day.mon'), tr('day.tue'), tr('day.wed'), tr('day.thu'), tr('day.fri'), tr('day.sat')]
  // Monday-first week; only days with a session render.
  const order = [1, 2, 3, 4, 5, 6, 0]
  const byDay = new Map<number, ClassSession[]>()
  for (const s of sessions) byDay.set(s.day, [...(byDay.get(s.day) ?? []), s].sort((a, b) => a.start.localeCompare(b.start)))
  const days = order.filter((d) => byDay.has(d))
  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label ?? tr('schedule.eyebrow')}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading ?? tr('schedule.heading')}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {days.map((d) => (
            <div key={d} className="rounded-2xl border border-fam-hairline bg-fam-surface p-5">
              <h3 className="font-display text-lg font-semibold text-fam-ink">{dayNames[d]}</h3>
              <ul className="mt-4 space-y-3">
                {byDay.get(d)!.map((s, i) => (
                  <li key={`${s.serviceName}-${s.start}-${i}`} className="rounded-xl border border-fam-hairline bg-fam-card p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-fam-accent-text-strong">
                      <Clock className="h-4 w-4" /> {fmt(s.start)}{s.end ? ` – ${fmt(s.end)}` : ''}
                    </div>
                    <div className="mt-1 font-display text-base font-semibold text-fam-ink">{s.serviceName}</div>
                    {(s.instructor || s.capacity) && (
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fam-ink-muted">
                        {s.instructor && <span>{tr('schedule.with')} {s.instructor}</span>}
                        {s.capacity && (
                          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {s.capacity} {tr('schedule.spots')}</span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
