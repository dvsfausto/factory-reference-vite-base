import { MessageCircle } from 'lucide-react'
import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'
import { HAS_PHONE } from '~/lib/phone'

/* ★ "TEXT US" (the Showcase theme, 2026-10-29). A small ink pill fixed bottom-right. There is no live web chat, so it opens a
   text message to the business's number (SITE.phone, the number every tel: link on the site uses) when the site has one, else
   the contact page. Kept small and in the corner; the Showcase footer leaves room under its last line so it never sits over words on a
   phone. Rendered only on a Showcase site (__root). */
export function TextUsPill() {
  const href = HAS_PHONE ? `sms:${SITE.phone}` : '/contact'
  return (
    <a
      href={href}
      data-text-us=""
      className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-[999px] bg-fam-ink px-5 py-3 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-fam-page shadow-[0_6px_20px_-8px_rgb(0_0_0/0.45)] transition-colors hover:bg-ink-700 focus-ring md:bottom-6 md:right-6"
    >
      <MessageCircle aria-hidden="true" className="h-4 w-4 text-fam-accent-tint" />
      {tr('showcase.textUs')}
    </a>
  )
}
