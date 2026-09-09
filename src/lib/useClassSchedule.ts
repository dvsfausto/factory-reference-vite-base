import { useEffect, useState } from 'react'
import { BUSINESS_ID, SITE, SUPABASE_ANON_KEY, SUPABASE_URL } from '~/data/site'

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
    const url =
      `${SUPABASE_URL}/rest/v1/site_content_items?business_id=eq.${BUSINESS_ID}&kind=eq.class_session&is_active=eq.true` +
      `&select=payload,sort_order&order=sort_order.asc`
    fetch(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rows: Array<{ payload?: Record<string, unknown> | null; sort_order?: number | null }>) => {
        if (cancelled || !Array.isArray(rows) || rows.length === 0) return
        const live = sessionsFromRows(rows)
        if (live.length > 0) setSessions(live)
      })
      .catch(() => {
        /* keep baked — degrade-safe */
      })
    return () => {
      cancelled = true
    }
  }, [])
  return sessions
}
