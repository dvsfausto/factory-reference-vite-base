/**
 * ★ ZB-296 (the owner, 2026-10-14): A LINK TO /book SHOWS ONLY WHEN BOOKING IS OPEN.
 * Booking is open when the owner's switch is on and their hours are confirmed (bookingLive), or, as the booking page itself
 * allows, the switch is on with hours unconfirmed and the studio has classes to book. When it is not open, every button and
 * menu link that leads to /book (or the homepage #book anchor) leads instead to the quote form when the site has one, else to
 * the contact form, and a plain button's words follow. Open sites are untouched: nothing here runs a change unless the live
 * answer is "closed". These functions are pure (no imports, gate = booking-shape bookingLive()) so the decision is tested apart from the page.
 */
export function bookingOpenFrom(gate: { live: boolean; reason: string }, switchOn: boolean, hasUpcomingClasses: boolean): boolean {
  if (gate.live) return true
  return switchOn && gate.reason === 'hours_unconfirmed' && hasUpcomingClasses
}

/** Whether a link leads to booking: /book (any query) on this site, or the homepage's #book anchor. */
export function isBookingHref(href: string, origin: string): boolean {
  let u: URL
  try { u = new URL(href, origin) } catch { return false }
  if (u.origin !== origin) return false
  if (u.pathname === '/book' || u.pathname === '/book/') return true
  return (u.pathname === '/' || u.pathname === '') && u.hash === '#book'
}

export type ClosedTarget = { href: string; kind: 'quote' | 'contact' }

/**
 * Where a booking link leads while booking is closed: the site's quote page, else the business's hosted quote form (the same
 * choice the booking page's closed card makes), else the contact form. A service named on the link (/book?service=<id>) stays
 * named on the site's own forms, so they can preselect it.
 */
export function closedTargetFor(href: string, origin: string, opts: { hasQuotePage: boolean; quoteUrl?: unknown; slugForServiceId: (id: string) => string | undefined }): ClosedTarget {
  let serviceSlug: string | undefined
  try {
    const u = new URL(href, origin)
    const id = u.searchParams.get('service')
    if (id) serviceSlug = opts.slugForServiceId(id) ?? undefined
  } catch { /* a plain target */ }
  const q = serviceSlug ? `?service=${encodeURIComponent(serviceSlug)}` : ''
  if (opts.hasQuotePage) return { href: `/quote${q}`, kind: 'quote' }
  /* the same choice the booking page's own closed card makes: the business's hosted quote form when it has one */
  if (typeof opts.quoteUrl === 'string' && /^https?:\/\//.test(opts.quoteUrl)) return { href: opts.quoteUrl, kind: 'quote' }
  return { href: `/contact${q}`, kind: 'contact' }
}

/** A plain button or menu link: one short run of words and nothing else that carries meaning (an icon may sit beside it). */
export function isPlainLabel(text: string, hasRichContent: boolean): boolean {
  const t = text.replace(/\s+/g, ' ').trim()
  return !hasRichContent && t.length > 0 && t.length <= 40
}
