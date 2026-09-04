import { customPagesData } from '~/data/custom-pages'
import { BOOKING, SITE } from '~/data/site'
import { SERVICES } from '~/data/services'
import { tr } from '~/lib/i18n'
import { serviceCtaTarget } from '~/lib/booking-shape'

/**
 * A SERVICE PAGE's own CTA (mixed catalogues): the service's `action` decides — book → /book?service=,
 * quote → /quote?service=, buy → /contact "Order" — and only pages that exist are targeted. No action, or
 * no page for it → the site-wide primaryCta(). See booking-shape.serviceCtaTarget.
 */
export function serviceCta(slug: string): { href: string; label: string } {
  const ref = SERVICES.find((s) => s.slug === slug)
  const site = primaryCta()
  if (!ref) return site
  const t = serviceCtaTarget(ref, {
    book: !!customPagesData['book'],
    quote: !!customPagesData['quote'],
    bookingWidget: BOOKING.enabled,
  })
  if (!t) return site
  const label = t.label === 'bookNow' ? tr('cta.bookNow') : t.label === 'getQuote' ? tr('cta.getQuote') : tr('cta.order')
  return { href: t.href, label }
}

// ─────────────────────────────────────────────────────────────────────────────
// THE PRIMARY CTA — the single source of truth for the one-click front door's TARGET and LABEL, so
// EVERY CTA (hero, nav, footer, CTA section, sticky) is affordance-correct with ZERO owner setup. A
// painter's CTA says "Get a quote", never "Get in touch". Editable after (SITE.cta override wins), but
// correct on arrival.
//
// Signal priority — every target must PROVABLY RESOLVE (never a dead CTA):
//   1. SITE.cta override (design_dna, durable) — the owner's edit / the scaffolder's page-aware affordance.
//   2. A widget PAGE that EXISTS (customPagesData['book'|'quote'|'shop']) → that page. Its presence is
//      the affordance AND the guarantee the link resolves.
//   3. The native booking wizard (BOOKING.enabled) → the homepage /#book anchor (the section is rendered).
//   4. Otherwise → "Get in touch" / /contact (a route that always exists).
//
// ⚠️ We do NOT route off raw `services.action` here. `action='book'` is a DEFAULT FLOOD (bookable
// defaults true → nearly every service reads 'book'), so a lead/multi-staff business — vetoed from the
// /book page, no quotable services — would otherwise get a "Book now" CTA pointing at a /book page that
// was never generated → 404. Likewise `action='buy'` → /shop, a page we don't generate yet. Deliberate
// affordance routing (quote/book) already flows through SITE.cta, which the scaffolder emits ONLY when
// the corresponding page exists. So here we trust PAGES, not actions. See affordance-gate-not-deliberate.
// ─────────────────────────────────────────────────────────────────────────────
export function primaryCta(): { href: string; label: string } {
  const override = (SITE as { cta?: { href?: string; label?: string } }).cta
  if (override?.href && override?.label) return { href: override.href, label: override.label }

  const hasPage = (slug: string) => !!customPagesData[slug]
  const base =
    hasPage('book')
      ? { href: '/book', label: tr('cta.bookNow') }
      : BOOKING.enabled
        ? { href: '/#book', label: tr('cta.bookNow') }
        : hasPage('quote')
          ? { href: '/quote', label: tr('cta.getQuote') }
          : hasPage('shop')
            ? { href: '/shop', label: tr('cta.shop') }
            : { href: '/contact', label: tr('cta.getInTouch') }
  // A partial override (only href OR only label) still wins for the field it sets.
  return { href: override?.href ?? base.href, label: override?.label ?? base.label }
}
