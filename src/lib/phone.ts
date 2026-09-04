import { SITE } from '~/data/site'

/**
 * ★ A site with no phone number MUST NOT render a phone button — and, since 2026-09-04, must not
 * EMIT one either. The factory used to emit `phone: "+"` when businesses.phone was null (now it emits
 * ""), and 55 call sites rendered `href={`tel:${SITE.phone}`}` unconditionally → a dead `tel:+`
 * anchor in the header, every hero, every CTA and the footer of every no-phone site (47 of 61 live
 * sites on 2026-09-04). The CSS choke point in styles/app.css (`a[href="tel:+"] { display: none }`)
 * only hid it; the served HTML still carried the dead link, and the "or call" copy around it.
 *
 * ONE rule, at the source: every `tel:` anchor and every "call us" phrase renders ONLY inside a
 * `HAS_PHONE &&` / `hasPhone(site.phone) &&` guard. scripts/check-contact-guards.mjs fails the build
 * on any `tel:${…phone}` outside one, so a new block cannot ship without it. SEO-1 already omits the
 * JSON-LD telephone the same way (seo.ts `telephone()`).
 */
export const hasPhone = (phone?: string | null): boolean => /\d/.test(phone ?? '')
export const HAS_PHONE: boolean = hasPhone(SITE.phone)
