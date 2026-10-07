import { customPagesData } from '~/data/custom-pages'
import { BOOKING, SITE } from '~/data/site'
import { SERVICES } from '~/data/services'
import { tr } from '~/lib/i18n'
import { serviceCtaTarget } from '~/lib/booking-shape'
import { readBakedProducts } from '~/lib/useProducts'
import { HOMEPAGE_LAYOUT } from '~/data/layout'

/**
 * A SERVICE PAGE's own CTA (mixed catalogues): the service's `action` decides — book → /book?service=,
 * quote → /quote?service= — and only pages that exist are targeted. No action, or no page for it → the
 * site-wide primaryCta(). See booking-shape.serviceCtaTarget. Products are their own thing (2026-09-29):
 * a service is never bought, so there is no order branch here.
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
  const label = t.label === 'bookNow' ? (REQUEST_MODE ? tr('cta.bookDate') : tr('cta.bookNow')) : tr('cta.getQuote')
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
//   2. A widget PAGE that EXISTS (customPagesData['book'|'quote']) → that page. Its presence is
//      the affordance AND the guarantee the link resolves.
//   3. The native booking wizard (BOOKING.enabled) → the homepage /#book anchor (the section is rendered).
//   4. Products are their own thing (2026-09-29): baked products AND the product grid on the homepage →
//      the /#products anchor (the section is rendered); a shop page was never generated.
//   5. Otherwise → "Get in touch" / /contact (a route that always exists).
//
// ⚠️ We do NOT route off raw `services.action` here. `action='book'` is a DEFAULT FLOOD (bookable
// defaults true → nearly every service reads 'book'), so a lead/multi-staff business — vetoed from the
// /book page, no quotable services — would otherwise get a "Book now" CTA pointing at a /book page that
// was never generated → 404. Deliberate
// affordance routing (quote/book) already flows through SITE.cta, which the scaffolder emits ONLY when
// the corresponding page exists. So here we trust PAGES, not actions. See affordance-gate-not-deliberate.
// ─────────────────────────────────────────────────────────────────────────────
/** ★ REQUEST MODE (ZB-147 W1.2): the business confirms a date only after its yes, a deposit and an agreement
 *  (website_config.features_enabled.booking_mode = 'request', emitted as SITE.bookingMode). The default words then ask,
 *  never promise: "Inquire about your date", "Book your date", "Check your date", "Check availability". An owner's own
 *  label (SITE.cta / ctaLabel / headerCtaLabel) still wins everywhere. */
export const REQUEST_MODE = (SITE as { bookingMode?: string }).bookingMode === 'request'

/** The inquiry path: the contact page's form (the owner's custom form when they have one), with the service named so the form can preselect it. */
export function inquiryCta(serviceSlug?: string): { href: string; label: string } {
  return { href: serviceSlug ? `/contact?service=${encodeURIComponent(serviceSlug)}` : '/contact', label: tr('cta.checkDate') }
}

export function primaryCta(): { href: string; label: string } {
  const override = (SITE as { cta?: { href?: string; label?: string } }).cta
  if (override?.href && override?.label) return { href: override.href, label: override.label }

  const hasPage = (slug: string) => !!customPagesData[slug]
  const base =
    REQUEST_MODE
      ? { href: '/contact', label: tr('cta.inquireDate') }
      : hasPage('book')
      ? { href: '/book', label: tr('cta.bookNow') }
      : BOOKING.enabled
        ? { href: '/#book', label: tr('cta.bookNow') }
        : hasPage('quote')
          ? { href: '/quote', label: tr('cta.getQuote') }
          : readBakedProducts().length > 0 && HOMEPAGE_LAYOUT.some((b) => b.type === 'productGrid')
            ? { href: '/#products', label: tr('cta.shop') }
            : { href: '/contact', label: tr('cta.getInTouch') }
  // A partial override (only href OR only label) still wins for the field it sets.
  return { href: override?.href ?? base.href, label: override?.label ?? base.label }
}

/**
 * The owner's OWN link for the main button: SITE.cta.href when it points at another site (an absolute
 * https URL the owner set by asking, editor field cta.href), else undefined. The default closing band
 * (CTASection) targets /contact rather than primaryCta(), so it reads this to follow an owner link too;
 * with no owner link it keeps /contact, byte-identical.
 */
export function ownerCtaLink(): string | undefined {
  const href = (SITE as { cta?: { href?: string } }).cta?.href
  return href && /^https?:\/\//i.test(href) ? href : undefined
}
