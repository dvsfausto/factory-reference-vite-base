// ZB-296: links to /book show only when booking is open. Checks the pure decisions in src/lib/booking-open.ts
// (Node's native type stripping, no build step). Every case is a rule a visitor would feel.
import assert from 'node:assert/strict'
import { bookingLive } from '../src/lib/booking-shape.ts'
import { bookingOpenFrom, isBookingHref, closedTargetFor, isPlainLabel } from '../src/lib/booking-open.ts'

let n = 0
const t = (name, fn) => { fn(); n++; console.log('  ✓', name) }
const O = 'https://site.example'
const open = (f, classes = false) => bookingOpenFrom(bookingLive(f), f?.booking === true, classes)

t('open only with the switch on and hours confirmed', () => {
  assert.equal(open({ booking: true, hours_confirmed_at: '2026-09-04T12:00:00Z' }), true)
  assert.equal(open({ booking: false, hours_confirmed_at: '2026-09-04T12:00:00Z' }), false)
  assert.equal(open({ booking: true }), false)
  assert.equal(open({ booking: false }), false)
  assert.equal(open(null), false)
})
t('a studio with the switch on and classes coming opens even before hours are confirmed (as the booking page does)', () => {
  assert.equal(open({ booking: true }, true), true)
  assert.equal(open({ booking: false }, true), false)
})
t('booking links are /book (any query) and the homepage #book anchor on this site only', () => {
  for (const h of ['/book', '/book?service=abc', 'https://site.example/book', '/#book', '/book/']) assert.equal(isBookingHref(h, O), true, h)
  for (const h of ['/contact', '/books', '/booking', '/services/book', 'https://other.example/book', '/#about', 'tel:+1555', 'mailto:a@b.c']) assert.equal(isBookingHref(h, O), false, h)
})
t('closed: the quote form when the site has one, else the contact form', () => {
  const s = () => undefined
  assert.deepEqual(closedTargetFor('/book', O, { hasQuotePage: true, slugForServiceId: s }), { href: '/quote', kind: 'quote' })
  assert.deepEqual(closedTargetFor('/book', O, { hasQuotePage: false, slugForServiceId: s }), { href: '/contact', kind: 'contact' })
  assert.deepEqual(closedTargetFor('/#book', O, { hasQuotePage: false, slugForServiceId: s }), { href: '/contact', kind: 'contact' })
})
t('no quote page but a hosted quote form: the hosted form, like the booking page closed card', () => {
  const s = () => undefined
  assert.deepEqual(closedTargetFor('/book', O, { hasQuotePage: false, quoteUrl: 'https://app.zmode.com/request/duno', slugForServiceId: s }), { href: 'https://app.zmode.com/request/duno', kind: 'quote' })
  assert.deepEqual(closedTargetFor('/book', O, { hasQuotePage: false, quoteUrl: 'javascript:alert(1)', slugForServiceId: s }), { href: '/contact', kind: 'contact' })
  assert.deepEqual(closedTargetFor('/book', O, { hasQuotePage: true, quoteUrl: 'https://app.zmode.com/request/x', slugForServiceId: s }), { href: '/quote', kind: 'quote' })
})
t('a service named on the link stays named on the form', () => {
  const s = (id) => (id === 'id-1' ? 'haircut' : undefined)
  assert.deepEqual(closedTargetFor('/book?service=id-1', O, { hasQuotePage: false, slugForServiceId: s }), { href: '/contact?service=haircut', kind: 'contact' })
  assert.deepEqual(closedTargetFor('/book?service=id-1', O, { hasQuotePage: true, slugForServiceId: s }), { href: '/quote?service=haircut', kind: 'quote' })
  assert.deepEqual(closedTargetFor('/book?service=gone', O, { hasQuotePage: false, slugForServiceId: s }), { href: '/contact', kind: 'contact' })
})
t('only a plain button changes its words; a card keeps its content', () => {
  assert.equal(isPlainLabel('Book now', false), true)
  assert.equal(isPlainLabel('  Book an appointment ', false), true)
  assert.equal(isPlainLabel('Reservar', false), true)
  assert.equal(isPlainLabel('Book now', true), false)
  assert.equal(isPlainLabel('', false), false)
  assert.equal(isPlainLabel('A long paragraph that is clearly not a button label at all', false), false)
})
console.log(`\ncheck-booking-open: ${n} passed`)
