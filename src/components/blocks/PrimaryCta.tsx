import { Link } from '@tanstack/react-router'
import type { CSSProperties, ReactNode } from 'react'
import { primaryCta } from '~/lib/primaryCta'

// ─────────────────────────────────────────────────────────────────────────────
// SHARED PRIMARY CTA TARGET (Arc 4a · Stage 2).
//
// The ONE place the primary call-to-action target is resolved, so EVERY primary CTA
// surface, every hero variant, every CTA-section variant, the sticky FloatingCTA, the
// default CTASection, and the header, behaves consistently regardless of which variant
// a business happens to render:
//   · booking-ON  (BOOKING.enabled) → anchors to the on-page booking wizard (/#book),
//     so clicking "Book Your Visit" scrolls the customer straight to booking. `/#book`
//     (not bare `#book`) so it also works from inner pages (service/area/info), which
//     navigate home then scroll, the wizard lives only on the homepage.
//   · booking-OFF → routes to the lead form via SPA <Link> (the `to` fallback, default
//     /contact) exactly as before, byte-identical for every non-booking business.
//
// Secondary CTAs (tel: links) are untouched. Callers pass their own className/style so
// each variant keeps its exact look; only the destination is centralized here.
// ─────────────────────────────────────────────────────────────────────────────
export function PrimaryCta({
  to,
  className,
  style,
  onClick,
  ariaLabel,
  children,
}: {
  /** Explicit target override. Default = the affordance CTA (primaryCta().href): a bookable business
   *  gets /#book, a quote-only trade /quote, a shop /shop, else /contact. */
  to?: string
  className?: string
  style?: CSSProperties
  onClick?: () => void
  ariaLabel?: string
  children: ReactNode
}) {
  const target = to ?? primaryCta().href
  // A hash target (/#book) scrolls the on-page wizard and must be a plain <a> (works from inner pages
  // too, they navigate home then scroll). A route target (/quote, /shop, /contact) is an SPA <Link>.
  const isHash = target.startsWith('#') || target.startsWith('/#')
  if (isHash) {
    return (
      <a href={target} className={className} style={style} onClick={onClick} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }
  return (
    <Link to={target} className={className} style={style} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  )
}
