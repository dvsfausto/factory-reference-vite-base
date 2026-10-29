// ZB-451 gate: the optional chrome settings (lib/chrome-extras.ts). Runs in the build; pure functions, no DOM.
import assert from 'node:assert/strict'
import { announcementOf, logoHeight, logoSizeOf, sizedLogoHeight, logoBarPx, streetFirst, textOn } from '../src/lib/chrome-extras'

// Nothing set: every function returns the layout's own value.
assert.equal(announcementOf({}), null)
assert.equal(logoHeight(44, 80, {}), 44)
assert.equal(streetFirst('Lima, Lima', { address: { street: 'Jr. Andahuaylas 381' } }, {}), 'Lima, Lima')

// Logo height: capped per bar (24px of air), every header layout, with the largest allowed value.
for (const [fallback, bar] of [[44, 80], [56, 96], [72, 96], [40, 80], [46, 80], [42, 72]] as const) {
  const h = logoHeight(fallback, bar, { logoHeight: 96 })
  assert.ok(h <= bar - 24, `logo ${h}px fits the ${bar}px bar`)
  assert.equal(logoHeight(fallback, bar, { logoHeight: 500 }), fallback, 'out of range = the default')
}
assert.equal(logoHeight(40, 80, { logoHeight: 56 }), 56, 'M&D: 56 on the 80px editorial bar')

// Logo size (2026-10-29): nothing set = null (today's size); the owner's height wins over the size; Showcase defaults to large.
assert.equal(logoSizeOf({}), null)
assert.equal(logoSizeOf({ theme: 'editorial' }), null)
assert.equal(logoSizeOf({ theme: 'showcase' }), 'large')
assert.equal(logoSizeOf({ theme: 'showcase', logoSize: 'small' }), 'small')
assert.equal(logoSizeOf({ logoSize: 'medium' }), 'medium')
assert.equal(logoSizeOf({ logoSize: 'huge' }), null)
assert.equal(logoSizeOf({ theme: 'showcase', logoHeight: 48, logoSize: 'large' }), null, 'the owner height wins')
for (const fallback of [44, 56, 72, 40, 46, 42]) {
  assert.equal(sizedLogoHeight(fallback, 'desktop', 'medium'), fallback)
  assert.ok(sizedLogoHeight(fallback, 'desktop', 'small') < fallback)
  assert.ok(sizedLogoHeight(fallback, 'desktop', 'large') >= 80 && sizedLogoHeight(fallback, 'phone', 'large') >= 56)
  // a large phone logo fits the smallest phone bar (80px) with 12px of air each side: phone bars never grow
  assert.ok(sizedLogoHeight(fallback, 'phone', 'large') <= 80 - 24 || fallback > 56)
}
assert.equal(logoBarPx(96, 80), 104)
assert.equal(logoBarPx(96, 56), 96)

// Announcement colours: a light ground gets dark text, a dark ground white; invalid colours dropped.
assert.equal(announcementOf({ announcement: { text: 'Hola', bg: '#FFE4F0' } })?.fg, '#111111')
assert.equal(announcementOf({ announcement: { text: 'Hola', bg: '#E6007A' } })?.fg, '#ffffff')
assert.deepEqual(announcementOf({ announcement: { text: ' Hola ', bg: 'red', fg: '#fff' } }), { text: 'Hola' })
assert.equal(textOn('#ffffff'), '#111111')

// Street: leads the line once, never twice, even when the place line already holds it.
const site = { address: { street: 'Jr. Andahuaylas 381, interior 116, Cercado de Lima' } }
assert.equal(streetFirst('Lima, Lima', site, { showStreet: true }), 'Jr. Andahuaylas 381, interior 116, Cercado de Lima, Lima, Lima')
assert.equal(streetFirst('jr. andahuaylas 381, interior 116, cercado de lima, Lima', site, { showStreet: true }), 'jr. andahuaylas 381, interior 116, cercado de lima, Lima')
assert.equal(streetFirst('', site, { showStreet: true }), site.address.street)
assert.equal(streetFirst('Lima', { address: { street: '  ' } }, { showStreet: true }), 'Lima')

console.log('✓ check-chrome-extras: announcement colours, logo caps on 6 header bars, street once, logo sizes')
