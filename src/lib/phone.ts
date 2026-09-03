import { SITE } from '~/data/site'

/**
 * ★ A site with no phone number MUST NOT render a phone button. The factory emits `phone: "+"` and
 * `phoneDisplay: ""` when businesses.phone is null (four of six real fixtures), and 55 call sites
 * render `href={`tel:${SITE.phone}`}` unconditionally → a dead `tel:+` button in the header, every
 * hero, every CTA and the footer of every no-phone site (seen live on a customer site, 2026-09-03).
 * Two guards, one rule:
 *   · anchors: `a[href="tel:+"], a[href="tel:"]` are removed in styles/app.css (one choke point,
 *     covers all 55 sites and any future one);
 *   · rows where an icon or label sits OUTSIDE the anchor use HAS_PHONE to omit the whole row.
 * SEO-1 already omits the JSON-LD telephone the same way (seo.ts `telephone()`).
 */
export const HAS_PHONE: boolean = /\d/.test(SITE.phone ?? '')
