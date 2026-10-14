import * as React from 'react'
import { useRouter } from '@tanstack/react-router'
import { BUSINESS_ID, SUPABASE_URL, SUPABASE_ANON_KEY } from '~/data/site'
import { SERVICES } from '~/data/services'
import { customPagesData } from '~/data/custom-pages'
import { tr } from '~/lib/i18n'
import { bookingLive, type BookingFeatures } from '~/lib/booking-shape'
import { liveClassesUrl, classWindowDays } from '~/lib/useClassSchedule'
import { bookingOpenFrom, isBookingHref, closedTargetFor, isPlainLabel } from '~/lib/booking-open'

const HEADERS = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }

/**
 * ★ ZB-296 (the owner, 2026-10-14): every button and menu link to /book shows only when booking is open. This reads the live
 * answer once per visit (the owner's switch and hours confirmation, the same read the booking page makes). Open, or the read
 * fails: nothing happens, so an open site renders exactly as before. Closed: each link that leads to booking leads to the quote
 * form (when the site has one) or the contact form instead, a plain button says "Get a quote" / "Get in touch" in the site's
 * language, and the same holds for links drawn later (a client-side page change). Clicks go through the router, never to /book.
 */
/** A hook, called inside the root component: it adds no element, so the page tree (and every useId the server renders) is unchanged. */
export function useBookingLinksFollowOpen() {
  const router = useRouter()
  React.useEffect(() => {
    /* widened to string: a generated site bakes BUSINESS_ID as a literal type, and comparing two different literals is a type error */
    const businessId: string = BUSINESS_ID
    if (!businessId || businessId === '00000000-0000-0000-0000-000000000000') return
    let cancelled = false
    let observer: MutationObserver | null = null
    let onClick: ((e: MouseEvent) => void) | null = null
    void (async () => {
      try {
        const r = await fetch(`${SUPABASE_URL}/rest/v1/website_config?business_id=eq.${BUSINESS_ID}&select=features_enabled`, { headers: HEADERS })
        if (!r.ok) return
        const rows = (await r.json()) as Array<{ features_enabled: BookingFeatures | null }>
        const features = rows[0]?.features_enabled ?? null
        let classes = false
        if (features?.booking === true && !features?.hours_confirmed_at) {
          try {
            const days = await classWindowDays(21)
            const c = await fetch(liveClassesUrl(BUSINESS_ID, days), { headers: HEADERS })
            classes = c.ok && ((await c.json()) as unknown[]).length > 0
          } catch { classes = false }
        }
        if (cancelled || bookingOpenFrom(bookingLive(features), features?.booking === true, classes)) return
        const origin = window.location.origin
        const hasQuotePage = !!customPagesData['quote']
        const slugForServiceId = (id: string) => SERVICES.find((s) => s.id === id)?.slug
        const apply = (root: ParentNode) => {
          for (const a of Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href]'))) {
            if (a.dataset.bookingClosed) continue
            const href = a.getAttribute('href') ?? ''
            if (!isBookingHref(href, origin)) continue
            const t = closedTargetFor(href, origin, { hasQuotePage, quoteUrl: (features as { quote_url?: unknown } | null)?.quote_url, slugForServiceId })
            a.setAttribute('href', t.href)
            a.dataset.bookingClosed = t.href
            const rich = !!a.querySelector('img, picture, h1, h2, h3, h4, p, ul, ol')
            const runs = Array.from(a.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE ? !!n.textContent?.trim() : true)
            const textNodes: Text[] = []
            const walk = (n: Node) => { for (const c of Array.from(n.childNodes)) { if (c.nodeType === Node.TEXT_NODE) { if (c.textContent?.trim()) textNodes.push(c as Text) } else if ((c as Element).tagName !== 'svg') walk(c) } }
            walk(a)
            if (runs.length > 0 && textNodes.length === 1 && isPlainLabel(textNodes[0].textContent ?? '', rich)) {
              textNodes[0].textContent = tr(t.kind === 'quote' ? 'cta.getQuote' : 'cta.getInTouch')
            }
          }
        }
        apply(document)
        observer = new MutationObserver((records) => { for (const m of records) for (const n of Array.from(m.addedNodes)) if (n.nodeType === Node.ELEMENT_NODE) { const el = n as Element; if (el.matches?.('a[href]')) apply(el.parentElement ?? document); else apply(el) } })
        observer.observe(document.body, { childList: true, subtree: true })
        onClick = (e: MouseEvent) => {
          const a = (e.target as Element | null)?.closest?.('a[data-booking-closed]') as HTMLAnchorElement | null
          if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
          const to = a.dataset.bookingClosed as string
          if (/^https?:\/\//.test(to)) return
          e.preventDefault()
          e.stopPropagation()
          void router.navigate({ href: to })
        }
        document.addEventListener('click', onClick, true)
      } catch { /* the live read failed: leave every link as it is */ }
    })()
    return () => { cancelled = true; observer?.disconnect(); if (onClick) document.removeEventListener('click', onClick, true) }
  }, [router])
}
