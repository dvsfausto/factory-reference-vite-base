import { useEffect, useState } from 'react'
import { BOOKING, BUSINESS_ID, SITE, SUPABASE_ANON_KEY, SUPABASE_URL } from '~/data/site'

// THE CLASS SCHEDULE READ (niche arc Stage 5b) — the booking-widget model over site_content_items rows of
// kind 'class_session' (the owner's weekly timetable, entered in the dashboard's Website → Content tab or
// through the assistant). SSR / first paint = SITE.classSchedule, baked by the scaffolder from the same rows
// at build; the client then reconciles LIVE so a session the owner adds or moves shows with no rebuild. A
// failed or empty read keeps the baked list. The live read runs only when the build baked something (the
// table exists and the owner has sessions) — never a request that can only fail.
export interface ClassSession {
  serviceName: string
  /** 0 = Sunday … 6 = Saturday */
  day: number
  /** 'HH:MM' */
  start: string
  end?: string
  instructor?: string
  capacity?: number
  /** a dated class (the classes arc): its id to book, its seats left (null = no limit), its date and instant */
  occurrenceId?: string
  serviceId?: string | null
  seatsLeft?: number | null
  date?: string
  startAt?: string
}

/** one dated class as the public schedule view serves it (class_schedule_public: no names, no bookings) */
export interface LiveClass {
  id: string
  service_id: string | null
  title: string
  instructor: string | null
  start_at: string
  end_at: string
  seats_total: number | null
  seats_left: number | null
}
const tzParts = (iso: string, tz: string) => {
  /* the weekday from the local DATE, never from a locale's spelling ("Wed." in en-CA on some browsers) */
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).formatToParts(new Date(iso))
  const g = (t: string) => parts.find((x) => x.type === t)?.value ?? ''
  const y = Number(g('year')); const m = Number(g('month')); const d = Number(g('day'))
  return { day: new Date(Date.UTC(y, m - 1, d)).getUTCDay(), date: `${g('year')}-${g('month')}-${g('day')}`, time: `${g('hour')}:${g('minute')}` }
}
/** the dated classes as timetable sessions, in the business's zone; pure so the check can read it */
export function sessionsFromClasses(rows: LiveClass[], tz: string): ClassSession[] {
  return rows
    .filter((r) => r && typeof r.id === 'string' && typeof r.start_at === 'string' && typeof r.title === 'string' && r.title.trim())
    .map<ClassSession>((r) => {
      const a = tzParts(r.start_at, tz); const b = tzParts(r.end_at, tz)
      return { serviceName: r.title.trim(), day: a.day, start: a.time, end: b.time, ...(r.instructor ? { instructor: r.instructor } : {}), ...(typeof r.seats_total === 'number' ? { capacity: r.seats_total } : {}), occurrenceId: r.id, serviceId: r.service_id ?? null, seatsLeft: r.seats_left ?? null, date: a.date, startAt: r.start_at }
    })
}
export function liveClassesUrl(businessId: string, days = 7, now = new Date()): string {
  const until = new Date(now.getTime() + days * 86_400_000).toISOString()
  return `${SUPABASE_URL}/rest/v1/class_schedule_public?business_id=eq.${businessId}&start_at=lt.${encodeURIComponent(until)}&select=id,service_id,title,instructor,start_at,end_at,seats_total,seats_left&order=start_at.asc`
}

export function readBakedSchedule(site: typeof SITE = SITE): ClassSession[] {
  const list = (site as { classSchedule?: ClassSession[] }).classSchedule
  return Array.isArray(list) ? list : []
}

// Mirrors factory-build/factory/scaffolder/src/lib/site-content.ts (the class_session branch): the same rules.
const time = (v: unknown): string | undefined => {
  const s = typeof v === 'string' ? v.trim() : ''
  const m = s.match(/^(\d{1,2}):(\d{2})/)
  return m ? `${m[1]!.padStart(2, '0')}:${m[2]}` : undefined
}

export function sessionsFromRows(rows: Array<{ payload?: Record<string, unknown> | null; sort_order?: number | null }>): ClassSession[] {
  return rows
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((r) => r.payload ?? {})
    .filter((p) => typeof p.serviceName === 'string' && (p.serviceName as string).trim() && time(p.start) && Number.isInteger(Number(p.day)) && Number(p.day) >= 0 && Number(p.day) <= 6)
    .map<ClassSession>((p) => ({
      serviceName: (p.serviceName as string).trim(),
      day: Number(p.day),
      start: time(p.start)!,
      ...(time(p.end) ? { end: time(p.end) } : {}),
      ...(typeof p.instructor === 'string' && p.instructor.trim() ? { instructor: p.instructor.trim() } : {}),
      ...(typeof p.capacity === 'number' && p.capacity > 0 ? { capacity: p.capacity } : {}),
    }))
}

export function useClassSchedule(): ClassSession[] {
  const [sessions, setSessions] = useState<ClassSession[]>(readBakedSchedule)
  useEffect(() => {
    if (readBakedSchedule().length === 0) return
    let cancelled = false
    const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    /* ★ THE REAL SCHEDULE FIRST (the classes arc, 2026-09-23): the next seven days of dated classes with seats left, read
       from the public schedule view. When any exist they are the page. Only when there are none does the weekly rule
       (site_content_items) load, so the two reads never race each other (the rule read used to land last and win). */
    const rulesFallback = () => {
      const url =
        `${SUPABASE_URL}/rest/v1/site_content_items?business_id=eq.${BUSINESS_ID}&kind=eq.class_session&is_active=eq.true` +
        `&select=payload,sort_order&order=sort_order.asc`
      return fetch(url, { headers })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((rows: Array<{ payload?: Record<string, unknown> | null; sort_order?: number | null }>) => {
          if (cancelled || !Array.isArray(rows) || rows.length === 0) return
          const live = sessionsFromRows(rows)
          if (live.length > 0) setSessions(live)
        })
    }
    fetch(liveClassesUrl(BUSINESS_ID), { headers })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rows: LiveClass[]) => {
        if (cancelled) return
        const live = Array.isArray(rows) && rows.length ? sessionsFromClasses(rows, BOOKING.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone) : []
        if (live.length > 0) setSessions(live)
        else return rulesFallback()
      })
      .catch(() => rulesFallback().catch(() => { /* keep baked, degrade-safe */ }))
    return () => {
      cancelled = true
    }
  }, [])
  return sessions
}
