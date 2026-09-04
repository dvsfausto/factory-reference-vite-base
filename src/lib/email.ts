import { SITE } from '~/data/site'

/**
 * ★ The website shows an email address ONLY when the owner set a public one (2026-09-04). SITE.email is
 * businesses.public_email (null by default → ""), never the account/signup address: 52 of 61 live sites
 * printed the owner's signup inbox in the header, footer, contact page and JSON-LD because onboarding
 * never asked for a public address and the emitter passed the account one through. The contact form
 * still reaches the owner (handle-website-lead → CRM contact), so a site with no address loses nothing.
 * scripts/check-contact-guards.mjs fails the build on any `mailto:` outside a HAS_EMAIL / hasEmail guard.
 */
export const hasEmail = (email?: string | null): boolean => /@/.test(email ?? '')
export const HAS_EMAIL: boolean = hasEmail(SITE.email)
