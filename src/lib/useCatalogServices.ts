import { useEffect, useRef, useState } from 'react'
import { BUSINESS_ID, SUPABASE_ANON_KEY, SUPABASE_URL } from '~/data/site'
import { servicesForActions } from '~/data/services-view'
import { kebab } from '~/lib/slug'
import type { ServiceRef } from '~/lib/types/page-types'

// ─────────────────────────────────────────────────────────────────────────────
// THE SHARED CATALOG-READ HOOK — the ONE place a catalog widget gets its service list, adopting
// BookingWizardBlock's live-read pattern (PostgREST + the baked anon key; RLS "Public can view active
// services" gates it). Parameterised by AFFORDANCE, so booking (['book']), cart (['buy']) and packages
// inherit it — that's the point of building it here, not in the quote block.
//
// STANDARD (ready-to-go storefront):
//   · SSR / first paint = the BAKED list (services are in the HTML → SEO, instant, no spinner).
//   · Client reconciles with a LIVE read → a service the owner adds AFTER the build appears with NO
//     rebuild (so a rebuild — which reverts copy edits — is never needed just to list a new service).
//   · Fetch failure → keep the baked list (degrade to today's behaviour, never an empty form).
// Zero owner setup: the anon key + BUSINESS_ID are baked; the read just works on day one.
// ─────────────────────────────────────────────────────────────────────────────
export function useCatalogServices(actions: ServiceRef['action'][]): ServiceRef[] {
  // Baked = SSR value + fallback. Recomputed only when the affordance set changes.
  const key = actions.join(',')
  const [services, setServices] = useState<ServiceRef[]>(() => servicesForActions(actions))
  const bakedRef = useRef(services)

  useEffect(() => {
    const baked = servicesForActions(actions)
    bakedRef.current = baked
    setServices(baked) // reset to baked when the affordance changes, before the live read lands
    let cancelled = false
    const url =
      `${SUPABASE_URL}/rest/v1/services?business_id=eq.${BUSINESS_ID}` +
      `&is_active=eq.true&select=id,name,action`
    fetch(url, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rows: { id: string; name: string; action: ServiceRef['action'] }[]) => {
        if (cancelled || !Array.isArray(rows)) return
        const live = rows
          .filter((s) => actions.includes(s.action))
          .map<ServiceRef>((s) => ({ slug: kebab(s.name), name: s.name, short: '', id: s.id, action: s.action }))
        // Only replace on a good, non-empty live read (a fresh service now appears). An empty or failed
        // read keeps the baked list so the form is never empty.
        if (live.length > 0) setServices(live)
      })
      .catch(() => {
        /* keep baked (bakedRef.current) — degrade-safe */
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return services
}
