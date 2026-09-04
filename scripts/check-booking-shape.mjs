// Checks the booking wizard's pure decisions (src/lib/booking-shape.ts). Runs on Node's
// native type stripping — no build step. Every case is a rule a customer would feel.
import assert from 'node:assert/strict'
import {
  isVisit, bookingLive, realPrice, priceLine, addressComplete, formatAddress, stepOrder, EMPTY_ADDRESS,
} from '../src/lib/booking-shape.ts'

const fmt = (n) => `$${n}`
let n = 0
const t = (name, fn) => { fn(); n++; console.log('  ✓', name) }

t('visit only when booking_model is visit', () => {
  assert.equal(isVisit({ booking_model: 'visit' }), true)
  assert.equal(isVisit({ booking_model: 'slot' }), false)
  assert.equal(isVisit({ booking_model: null }), false)
  assert.equal(isVisit(undefined), false)
})
t('booking is live only with the switch on AND hours confirmed', () => {
  assert.deepEqual(bookingLive(null), { live: false, reason: 'no_config' })
  assert.deepEqual(bookingLive({ booking: false, hours_confirmed_at: '2026-09-04T00:00:00Z' }), { live: false, reason: 'switch_off' })
  assert.deepEqual(bookingLive({ booking: true }), { live: false, reason: 'hours_unconfirmed' })
  assert.deepEqual(bookingLive({ booking: true, hours_confirmed_at: 'not a date' }), { live: false, reason: 'hours_unconfirmed' })
  assert.deepEqual(bookingLive({ booking: true, hours_confirmed_at: '2026-09-04T12:00:00Z' }), { live: true, reason: 'live' })
})
t('the seeded default (switch off, no confirmation) is NOT live', () => {
  // Every business gets Mon–Fri 09:00–17:00 at signup and features_enabled { booking: false }.
  assert.equal(bookingLive({ booking: false }).live, false)
})
t('a null or zero price is never $0', () => {
  assert.equal(realPrice(null), null)
  assert.equal(realPrice(0), null)
  assert.equal(realPrice(-5), null)
  assert.equal(realPrice(NaN), null)
  assert.equal(realPrice(45), 45)
})
t('price line: amount, on-site for an unpriced visit, nothing for an unpriced shop service', () => {
  assert.deepEqual(priceLine({ price: 20, booking_model: 'slot' }, fmt), { kind: 'amount', text: '$20' })
  assert.deepEqual(priceLine({ price: 20, booking_model: 'visit' }, fmt), { kind: 'amount', text: '$20' })
  assert.deepEqual(priceLine({ price: null, booking_model: 'visit' }, fmt), { kind: 'on_site' })
  assert.deepEqual(priceLine({ price: 0, booking_model: 'visit' }, fmt), { kind: 'on_site' })
  assert.deepEqual(priceLine({ price: null, booking_model: 'slot' }, fmt), { kind: 'none' })
  assert.deepEqual(priceLine({ price: 0, booking_model: null }, fmt), { kind: 'none' })
})
t('an address needs street, city and zip; unit and state are optional', () => {
  assert.equal(addressComplete(EMPTY_ADDRESS), false)
  assert.equal(addressComplete({ ...EMPTY_ADDRESS, line1: '12 Palm Ave', city: 'Miami' }), false)
  assert.equal(addressComplete({ ...EMPTY_ADDRESS, line1: '12 Palm Ave', city: 'Miami', zip: '33101' }), true)
  assert.equal(addressComplete({ ...EMPTY_ADDRESS, line1: '12 Palm Ave', line2: 'Apt 4', city: 'Miami', state: 'FL', zip: '33101' }), true)
})
t('address formats on one line without empty parts', () => {
  assert.equal(formatAddress({ line1: '12 Palm Ave', line2: '', city: 'Miami', state: 'FL', zip: '33101' }), '12 Palm Ave, Miami, FL 33101')
  assert.equal(formatAddress({ line1: '12 Palm Ave', line2: 'Apt 4', city: 'Miami', state: '', zip: '33101' }), '12 Palm Ave, Apt 4, Miami, 33101')
  assert.equal(formatAddress(null), '')
})
t('a visit asks where before the details', () => {
  assert.deepEqual(stepOrder(true), ['service', 'date', 'time', 'address', 'details'])
  assert.deepEqual(stepOrder(false), ['service', 'date', 'time', 'details'])
})
console.log(`booking-shape: ${n}/${n} checks passed`)
