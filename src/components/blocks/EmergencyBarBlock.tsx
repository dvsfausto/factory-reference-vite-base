import { Phone } from 'lucide-react'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { hasPhone } from '~/lib/phone'

// Emergency call bar (niche arc Stage 4, 2026-09-08) — the phone-first strip the Emergency Local
// template leads with: a live dot, a short heading, the owner's STATED hours, and the phone as the one
// action. On a phone it also pins a call button to the bottom of the screen (thumb reach), so the
// number is one tap away at any scroll depth.
//
// HIDES ITSELF WITHOUT A PHONE: returns null (no empty button, no dead tel: link) — the no-phone rule
// from the V3 launch (phoneAreaCode null → nothing provisioned) bites here, and the block honours it.
//
// Copy: `heading` and `body` are block text params (block.emergencyBar.heading / .body — the editor's
// durable text channel). Defaults: a neutral prompt and the site's stated hours (SITE.hours, the owner's
// own input at launch; empty → no line). Nothing here asserts 24/7, response times or coverage.
//
// TOKEN DISCIPLINE: ground = fam-ink (the family's ink as a dark band), text white; the dot and the
// call button = the CTA slot (bg-cta / text-cta-foreground). Radius -> rounded-* (DNA). Font ->
// font-display (DNA). No literal colours.
export function EmergencyBarBlock({
  site = SITE,
  heading,
  body,
}: {
  site?: typeof SITE
  heading?: string
  body?: string
}) {
  // Guarded twice on purpose: the early return omits the block; the ternary is the build's tel: guard.
  if (!hasPhone(site.phone)) return null
  const tel = hasPhone(site.phone) ? `tel:${site.phone}` : ''
  const headingText = heading ?? tr('emergency.heading')
  const bodyText = body ?? site.hours ?? ''
  return (
    <section className="bg-fam-ink-panel text-fam-on-dark">
      <div className="container-x flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cta" />
          </span>
          <span className="font-display text-sm font-semibold sm:text-base">{headingText}</span>
          {bodyText && <span className="hidden truncate text-sm text-fam-on-dark/70 sm:inline">{bodyText}</span>}
        </div>
        <a
          href={tel}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-cta px-5 font-display text-sm font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade) sm:text-base"
        >
          <Phone className="h-4 w-4" /> {site.phoneDisplay}
        </a>
      </div>
      {/* Thumb-reach call button on phones only; the strip above is the desktop surface. */}
      <a
        href={tel}
        className="fixed inset-x-4 bottom-4 z-40 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-cta font-display text-base font-semibold text-cta-foreground shadow-(--elev-3) md:hidden"
      >
        <Phone className="h-5 w-5" /> {tr('emergency.callNow')} {site.phoneDisplay}
      </a>
    </section>
  )
}
