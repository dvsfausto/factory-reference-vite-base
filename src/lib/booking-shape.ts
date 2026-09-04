// ─────────────────────────────────────────────────────────────────────────────
// BOOKING SHAPE — the pure decisions the booking wizard makes, kept out of the
// component so they can be checked without a browser (scripts/check-booking-shape.mjs).
//
// Three questions, answered from LIVE data (the wizard reads them anonymously):
//   1. Does this service happen at the customer's address?  services.booking_model = 'visit'
//      (cleaners, landscapers, movers, mobile car wash). Then the wizard asks WHERE, the
//      time is an arrival time, and the price is confirmed on site when none is set.
//   2. Is online booking LIVE for this business?  website_config.features_enabled.booking
//      is the owner's switch (Booking Settings), and hours_confirmed_at is the owner's
//      confirmation of the weekly hours the scheduler offers. Hours are seeded at signup
//      (Mon–Fri 09:00–17:00) for every business, so an unconfirmed calendar must never
//      take a booking — the wizard shows "opens soon" and create-booking refuses.
//   3. What does the price line say?  A real price renders; null/0 renders NOTHING for a
//      shop service (barber "Haircut" price 0 = not priced) and "confirmed on site" for a
//      visit service, and is never "$0".
// ─────────────────────────────────────────────────────────────────────────────

export type BookingModel = 'slot' | 'day' | 'visit' | null | undefined

export interface ServiceShape {
  booking_model?: BookingModel
  price: number | null
  duration_minutes?: number | null
}

export interface ServiceAddress {
  line1: string
  line2: string
  city: string
  state: string
  zip: string
}

export interface BookingFeatures {
  booking?: boolean | null
  hours_confirmed_at?: string | null
}

export type LiveReason = 'live' | 'switch_off' | 'hours_unconfirmed' | 'no_config'

export const EMPTY_ADDRESS: ServiceAddress = { line1: '', line2: '', city: '', state: '', zip: '' }

/** At the customer's address (a visit) rather than at the business. */
export function isVisit(service: Pick<ServiceShape, 'booking_model'> | null | undefined): boolean {
  return service?.booking_model === 'visit'
}

/** The owner's switch AND the owner's hours confirmation, both required. */
export function bookingLive(features: BookingFeatures | null | undefined): { live: boolean; reason: LiveReason } {
  if (!features) return { live: false, reason: 'no_config' }
  if (features.booking !== true) return { live: false, reason: 'switch_off' }
  const at = features.hours_confirmed_at
  if (typeof at !== 'string' || !at.trim() || Number.isNaN(Date.parse(at))) {
    return { live: false, reason: 'hours_unconfirmed' }
  }
  return { live: true, reason: 'live' }
}

/** A real charge, or null. 0 / NaN / negative are "not priced", never "$0". */
export function realPrice(price: number | null | undefined): number | null {
  if (price == null || typeof price !== 'number' || Number.isNaN(price) || price <= 0) return null
  return price
}

/**
 * What the price line shows: a formatted amount, the "confirmed on site" note (visit work
 * with no price), or nothing (shop service with no price — the barber case, unchanged).
 */
export function priceLine(
  service: ServiceShape,
  fmt: (amount: number) => string,
): { kind: 'amount'; text: string } | { kind: 'on_site' } | { kind: 'none' } {
  const p = realPrice(service.price)
  if (p != null) return { kind: 'amount', text: fmt(p) }
  if (isVisit(service)) return { kind: 'on_site' }
  return { kind: 'none' }
}

/** Street + city + zip are the minimum a crew needs to arrive; unit and state are optional. */
export function addressComplete(a: ServiceAddress | null | undefined): boolean {
  if (!a) return false
  return a.line1.trim().length > 2 && a.city.trim().length > 1 && a.zip.trim().length >= 4
}

export function formatAddress(a: ServiceAddress | null | undefined): string {
  if (!a) return ''
  const street = [a.line1.trim(), a.line2.trim()].filter(Boolean).join(', ')
  const cityLine = [a.city.trim(), [a.state.trim(), a.zip.trim()].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(', ')
  return [street, cityLine].filter(Boolean).join(', ')
}

/** The wizard's step order: a visit asks WHERE before the details. */
export function stepOrder(visit: boolean): Array<'service' | 'date' | 'time' | 'address' | 'details'> {
  return visit ? ['service', 'date', 'time', 'address', 'details'] : ['service', 'date', 'time', 'details']
}
