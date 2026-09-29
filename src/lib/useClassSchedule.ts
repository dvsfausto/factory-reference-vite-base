import { useEffect, useState } from 'react'
import { BOOKING, BUSINESS_ID, SITE, SUPABASE_ANON_KEY, SUPABASE_URL } from '~/data/site'

// THE CLASS SCHEDULE READ (niche arc Stage 5b) — the booking-widget model over the owner's dated classes
// (class_schedule_public) and, when none are dated yet, the weekly rule (class_rules_public). SSR / first
// paint = SITE.classSchedule, baked by the scaffolder from the same rows at build; the client then reconciles
// LIVE so a session the owner adds or moves shows with no rebuild. A failed or empty read keeps the baked
// list. The live read runs only when the build baked something (the owner has classes) — never a request
// that can only fail.
// ★ CLASSES ARE THEIR OWN THING (the owner, 2026-09-29): a class kind is never a service and the weekly rule is its
//   own row, never website content. The names below stay for the baked shape; `serviceName` IS the kind's name.
export interface ClassSession {
  /** the class kind's name (kept as serviceName for the baked shape and the manifest; it is never a service) */
  serviceName: string
  /** 0 = Sunday … 6 = Saturday */
  day: number
  /** 'HH:MM' */
  start: string
  end?: string
  instructor?: string
  capacity?: number
  /** the room's name when the owner named one */
  room?: string
  /** a dated class (the classes arc): its id to book, its kind, its seats left (null = no limit), its date and instant */
  occurrenceId?: string
  kindId?: string | null
  seatsLeft?: number | null
  isFull?: boolean
  date?: string
  startAt?: string
}

/** one dated class as the public schedule view serves it (class_schedule_public: no names, no bookings) */
export interface LiveClass {
  id: string
  title: string
  /** legacy free text; instructor_name (the kind's row) wins when set */
  instructor: string | null
  /** the class kind (2026-09-29): the id a booking carries, its name and single price */
  kind_id: string | null
  kind_name: string | null
  price_single: number | null
  instructor_name: string | null
  room_name?: string | null
  start_at: string
  end_at: string
  seats_total: number | null
  seats_left: number | null
  /** ★ the owner may hide the count (2026-09-26): seats_left reads null then; is_full still says whether the class is full */
  is_full?: boolean | null
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
      const who = (r.instructor_name ?? r.instructor)?.trim()
      return { serviceName: (r.kind_name ?? r.title).trim(), day: a.day, start: a.time, end: b.time, ...(who ? { instructor: who } : {}), ...(typeof r.seats_total === 'number' ? { capacity: r.seats_total } : {}), ...(r.room_name?.trim() ? { room: r.room_name.trim() } : {}), occurrenceId: r.id, isFull: r.is_full === true, kindId: r.kind_id ?? null, seatsLeft: r.seats_left ?? null, date: a.date, startAt: r.start_at }
    })
}
/** ★ HOW FAR AHEAD A CUSTOMER SEES (part 3, 2026-09-26): the owner's class horizon (class_settings_public.horizon_days), read once;
 *  null = not set, and every surface keeps its own window (7 days here, 21 in the wizard and the portal), exactly as before. */
export type ClassHorizon = { days: number | null; nextBeyond: string | null; /** the owner's waitlist switch (2026-09-26): off, a full class says Full and takes no names */ waitlist: boolean }
let horizonPromise: Promise<ClassHorizon> | null = null
/** the owner's horizon and the first class a customer cannot see yet (so the page can say a later class exists) */
export function classHorizon(): Promise<ClassHorizon> {
  if (!horizonPromise) horizonPromise = fetch(`${SUPABASE_URL}/rest/v1/class_settings_public?business_id=eq.${BUSINESS_ID}&select=horizon_days,next_beyond_horizon,waitlist_enabled`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } })
    .then((r) => (r.ok ? r.json() : []))
    .then((rows: Array<{ horizon_days: number | null; next_beyond_horizon: string | null; waitlist_enabled?: boolean | null }>) => { const v = rows?.[0]?.horizon_days; return { waitlist: rows?.[0]?.waitlist_enabled !== false, days: typeof v === 'number' && v > 0 ? v : null, nextBeyond: rows?.[0]?.next_beyond_horizon ?? null } })
    .catch(() => ({ days: null, nextBeyond: null, waitlist: true }))
  return horizonPromise
}
export function classHorizonDays(): Promise<number | null> { return classHorizon().then((h) => h.days) }
export async function classWindowDays(fallback: number): Promise<number> { return (await classHorizonDays()) ?? fallback }
export function liveClassesUrl(businessId: string, days = 7, now = new Date()): string {
  const until = new Date(now.getTime() + days * 86_400_000).toISOString()
  return `${SUPABASE_URL}/rest/v1/class_schedule_public?business_id=eq.${businessId}&start_at=lt.${encodeURIComponent(until)}&select=id,title,instructor,start_at,end_at,seats_total,seats_left,is_full,kind_id,kind_name,price_single,instructor_name,room_name&order=start_at.asc`
}

export function readBakedSchedule(site: typeof SITE = SITE): ClassSession[] {
  const list = (site as { classSchedule?: ClassSession[] }).classSchedule
  return Array.isArray(list) ? list : []
}

const time = (v: unknown): string | undefined => {
  const s = typeof v === 'string' ? v.trim() : ''
  const m = s.match(/^(\d{1,2}):(\d{2})/)
  return m ? `${m[1]!.padStart(2, '0')}:${m[2]}` : undefined
}

/** one weekly rule as the public view serves it (class_rules_public: the owner's timetable, its own row since 2026-09-29) */
export interface LiveRule {
  id: string
  kind_id: string | null
  kind_name: string | null
  weekday: number
  start_time: string
  end_time: string | null
  spots: number | null
  starts_on: string | null
  ends_on: string | null
  instructor_name: string | null
  room_name: string | null
}
/** the weekly rules as timetable sessions; a rule that has not started by the week shown, or ended before it, is dropped. Pure. */
export function sessionsFromRules(rows: LiveRule[], weekFrom: string, weekUntil: string): ClassSession[] {
  return rows
    .filter((r) => r && typeof r.kind_name === 'string' && r.kind_name.trim() && time(r.start_time) && Number.isInteger(Number(r.weekday)) && Number(r.weekday) >= 0 && Number(r.weekday) <= 6)
    .filter((r) => !(typeof r.starts_on === 'string' && r.starts_on > weekUntil) && !(typeof r.ends_on === 'string' && r.ends_on < weekFrom))
    .map<ClassSession>((r) => ({
      serviceName: r.kind_name!.trim(),
      day: Number(r.weekday),
      start: time(r.start_time)!,
      ...(time(r.end_time) ? { end: time(r.end_time) } : {}),
      ...(typeof r.instructor_name === 'string' && r.instructor_name.trim() ? { instructor: r.instructor_name.trim() } : {}),
      ...(typeof r.spots === 'number' && r.spots > 0 ? { capacity: r.spots } : {}),
      ...(typeof r.room_name === 'string' && r.room_name.trim() ? { room: r.room_name.trim() } : {}),
      kindId: r.kind_id ?? null,
    }))
}

/** the span the week timetable block shows: seven days, one card per day */
export const WEEK_BLOCK_DAYS = 7
/** ★ ONE WEEK OF DATED CLASSES (2026-09-29, twice). The block is headed "This week" and groups by weekday, so it shows ONE
 *  seven-day span, never every date in the owner's horizon (30 days listed the same Monday 9:30 five times, 51 cards,
 *  6,733px on a phone). The span starts at the FIRST upcoming dated class, not at today: a studio whose classes begin
 *  next Monday shows that whole week, not one lonely Monday (the first cut read "the next seven days" and Fitcycling's
 *  section fell from a full week to one day). Sessions without dates (the weekly rule) pass through untouched. Pure. */
export type LaterClass = { serviceName: string; date: string; start: string }
export function weekSpan(sessions: ClassSession[], days = WEEK_BLOCK_DAYS): { sessions: ClassSession[]; from: string | null; later: LaterClass[] } {
  const dated = sessions.filter((s) => typeof s.date === 'string' && s.date)
  if (dated.length === 0 || dated.length !== sessions.length) return { sessions, from: null, later: [] }
  const from = dated.map((s) => s.date!).sort()[0]!
  const [y, m, d] = from.split('-').map(Number)
  const until = new Date(Date.UTC(y!, m! - 1, d! + days)).toISOString().slice(0, 10)
  const shown = dated.filter((s) => s.date! < until)
  /* ★ A CLASS THAT STARTS AFTER THE WEEK SHOWN (2026-09-29, the owner's new Wednesday class began the week after and the
     section said nothing): every class name absent from the shown week is named with its first date and time, so an
     owner who adds a class sees it on the page today and a customer knows it is coming. */
  const named = new Set(shown.map((s) => s.serviceName))
  const later = new Map<string, LaterClass>()
  for (const s of [...dated].sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`))) {
    if (s.date! >= until && !named.has(s.serviceName) && !later.has(s.serviceName)) later.set(s.serviceName, { serviceName: s.serviceName, date: s.date!, start: s.start })
  }
  return { sessions: shown, from, later: [...later.values()] }
}
export function useClassSchedule(): ClassSession[] {
  const [sessions, setSessions] = useState<ClassSession[]>(readBakedSchedule)
  useEffect(() => {
    if (readBakedSchedule().length === 0) return
    let cancelled = false
    const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    /* ★ THE REAL SCHEDULE FIRST (the classes arc, 2026-09-23): the next seven days of dated classes with seats left, read
       from the public schedule view. When any exist they are the page. Only when there are none does the weekly rule
       (class_rules_public, its own row since 2026-09-29) load, so the two reads never race each other. A rule that
       starts after this week or ended before it is not shown. */
    const rulesFallback = () => {
      const url =
        `${SUPABASE_URL}/rest/v1/class_rules_public?business_id=eq.${BUSINESS_ID}` +
        `&select=id,kind_id,kind_name,weekday,start_time,end_time,spots,starts_on,ends_on,instructor_name,room_name&order=weekday.asc,start_time.asc`
      const from = new Date().toISOString().slice(0, 10)
      const until = new Date(Date.now() + WEEK_BLOCK_DAYS * 86_400_000).toISOString().slice(0, 10)
      return fetch(url, { headers })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((rows: LiveRule[]) => {
          if (cancelled || !Array.isArray(rows) || rows.length === 0) return
          const live = sessionsFromRules(rows, from, until)
          if (live.length > 0) setSessions(live)
        })
    }
    classWindowDays(7).then((days) => fetch(liveClassesUrl(BUSINESS_ID, days), { headers }))
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
