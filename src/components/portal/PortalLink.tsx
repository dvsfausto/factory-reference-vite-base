import { useEffect, useState } from 'react'
import { SUPABASE_URL, SUPABASE_ANON_KEY, BUSINESS_ID } from '~/data/site'
import { tr } from '~/lib/i18n'

/** "My bookings" in the footer, only when the business has the customer portal on (read live; the footer itself is baked). */
export function PortalLink({ className }: { className?: string }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!BUSINESS_ID || !SUPABASE_URL) return
    let stale = false
    void (async () => {
      try {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/website_config?business_id=eq.${BUSINESS_ID}&select=features_enabled`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } })
        const rows = (await r.json()) as Array<{ features_enabled: { portal?: boolean } | null }>
        if (!stale && rows[0]?.features_enabled?.portal === true) setOn(true)
      } catch { /* no link */ }
    })()
    return () => { stale = true }
  }, [])
  if (!on) return null
  return <a href="/my" data-portal-link className={className}>{tr('footer.portal')}</a>
}
