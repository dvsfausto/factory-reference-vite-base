import { SERVICES } from '~/data/services-view'
import { customPagesData } from '~/data/custom-pages'
import { BOOKING, SITE } from '~/data/site'

// ─────────────────────────────────────────────────────────────────────────────
// THE PRIMARY CTA — the single source of truth for the one-click front door's TARGET and LABEL, so
// EVERY CTA (hero, nav, footer, CTA section, sticky) is affordance-correct with ZERO owner setup. A
// painter's CTA says "Get a quote", never "Get in touch". Editable after (SITE.cta override wins), but
// correct on arrival.
//
// Signal priority (each is an AUTHORITATIVE "this business offers this action", so we never fall to the
// generic contact label when a real affordance exists):
//   1. SITE.cta override (design_dna, durable) — the owner's edit.
//   2. A widget PAGE exists (customPagesData['quote'|'book'|'shop']) — its very presence proves the
//      affordance, independent of how services.ts was emitted.
//   3. The native booking wizard (BOOKING.enabled) or a service action.
//   4. Only if NONE of the above → "Get in touch" / /contact.
// ─────────────────────────────────────────────────────────────────────────────
export function primaryCta(): { href: string; label: string } {
  const override = (SITE as { cta?: { href?: string; label?: string } }).cta
  if (override?.href && override?.label) return { href: override.href, label: override.label }

  const hasPage = (slug: string) => !!customPagesData[slug]
  const actions = new Set(SERVICES.map((s) => s.action))
  const base =
    BOOKING.enabled || hasPage('book') || actions.has('book')
      // A dedicated /book PAGE is the shareable front door ("text your customer the link"),
      // so it wins over the on-page /#book anchor whenever it exists. /#book only when the
      // homepage wizard is the sole booking surface (legacy solo build, no /book page yet).
      ? { href: hasPage('book') ? '/book' : BOOKING.enabled ? '/#book' : '/book', label: 'Book now' }
      : hasPage('quote') || actions.has('collect') || actions.has('quote')
        ? { href: '/quote', label: 'Get a quote' }
        : hasPage('shop') || actions.has('buy')
          ? { href: '/shop', label: 'Shop' }
          : { href: '/contact', label: 'Get in touch' }
  // A partial override (only href OR only label) still wins for the field it sets.
  return { href: override?.href ?? base.href, label: override?.label ?? base.label }
}
