import { SERVICES } from '~/data/services-view'
import { BOOKING, SITE } from '~/data/site'

// ─────────────────────────────────────────────────────────────────────────────
// THE PRIMARY CTA — the one-click front door to the business's main action, derived from the CATALOG
// so it is right with ZERO owner setup (a ready-to-go storefront). Label + target come from the
// affordance, so a painter's hero never says "Book now":
//   · bookable (BOOKING wizard on, or a service with action 'book') → "Book now"  → /#book
//   · quotable ('collect' = quote-only no price, or 'quote')        → "Get a quote"→ /quote
//   · purchasable ('buy')                                            → "Shop"       → /shop
//   · none of the above                                              → "Get in touch"→ /contact
// The LABEL stays editable as a param: an emitted SITE.cta.{href,label} override (design_dna, durable)
// wins over the affordance default. Read from SERVICES (baked at SSR → SEO/instant; the live hook keeps
// the FORM fresh, while the CTA target is a route that doesn't change per service).
// NOTE: with several affordances the *primary* is ideally the owner's purchase answer (sell_mode); until
// that's emitted, we pick by the priority below and the other actions still live on their own pages.
// ─────────────────────────────────────────────────────────────────────────────
export function primaryCta(): { href: string; label: string } {
  const actions = new Set(SERVICES.map((s) => s.action))
  const base =
    BOOKING.enabled || actions.has('book')
      ? { href: '/#book', label: 'Book now' }
      : actions.has('collect') || actions.has('quote')
        ? { href: '/quote', label: 'Get a quote' }
        : actions.has('buy')
          ? { href: '/shop', label: 'Shop' }
          : { href: '/contact', label: 'Get in touch' }
  const override = (SITE as { cta?: { href?: string; label?: string } }).cta
  return { href: override?.href ?? base.href, label: override?.label ?? base.label }
}
