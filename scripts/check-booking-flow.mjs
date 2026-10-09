// ★ ZB-180 (2026-10-07): the booking page's four promises, checked against the files that ship.
//   1. letting a held spot go asks first (Yes / Keep my spot), never one tap;
//   2. the paid return hands the class the pack was bought for to the hold flow ("you're booked"), never "pick a class below";
//   3. the portal session is kept in localStorage too, so a checkout that comes back in a new tab finds it;
//   4. the words exist in English and Spanish.
import fs from 'node:fs'
const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')
const fails = []
const held = read('src/components/blocks/HeldBookingFlow.tsx')
if (!/data-held-action="release"[^>]*onClick=\{\(\) => setAskRelease\(true\)\}/.test(held)) fails.push('1: the release link must open the question, not release')
if (!/data-held-action="release-yes"/.test(held) || !/data-held-action="release-keep"/.test(held)) fails.push('1: the question needs Yes and Keep my spot')
const wiz = read('src/components/blocks/BookingWizardBlock.tsx')
if (!/paidInfo\.klass\?\.booking_id && paidInfo\.klass\.token \? \(/.test(wiz) || !/<HeldBookingFlow entry=\{\{ bookingId: paidInfo\.klass\.booking_id/.test(wiz)) fails.push('2: the paid return must hand the booked class to HeldBookingFlow')
const sessionLib = read('src/lib/portal-session.ts')
if (!/localStorage\.getItem\(SESSION_KEY\)/.test(sessionLib) || !/localStorage\.setItem\(SESSION_KEY/.test(sessionLib)) fails.push('3: the portal session must be kept in localStorage too')
for (const f of ['src/components/portal/CustomerPortal.tsx', 'src/components/blocks/ClassBookingFlow.tsx']) { const t = read(f); if (/sessionStorage\.(get|set|remove)Item\(SESSION_KEY/.test(t) || !/from '~\/lib\/portal-session'/.test(t)) fails.push(`3: ${f} must use the one session seam`) }
const i18n = read('src/lib/i18n.ts')
for (const k of ['booking.releaseAsk', 'booking.releaseYes', 'booking.keepMySpot', 'booking.paidBooked']) if ((i18n.match(new RegExp(`'${k.replace('.', '\\.')}':`, 'g')) || []).length < 2) fails.push(`4: ${k} needs English and Spanish`)
/* ★ ZB-194 (2026-10-08): 5. the paid return keeps the buyer: the landed sale's portal session is written to the one seam, so a pack
   bought from the Packs section continues to "pick a class" as the buyer (no phone, no code, the credit in hand). */
if (!/import \{ writeSession \} from '~\/lib\/portal-session'/.test(wiz) || !/if \(j\.paid && j\.landed && typeof j\.session === 'string' && j\.session\) writeSession\(j\.session\)/.test(wiz)) fails.push('5: the paid return must write the sale\'s portal session to the seam once the sale has landed')
if (fails.length) { console.error('✗ check-booking-flow:\n  ' + fails.join('\n  ')); process.exit(1) }
console.log('✓ check-booking-flow: release asks first, the paid return continues the booked class, the portal session survives the hop, EN+ES words')
