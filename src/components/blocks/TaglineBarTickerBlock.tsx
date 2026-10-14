import { Asterisk } from 'lucide-react'
import { SITE } from '~/data/site'
import { hasText } from '~/lib/has-text'

// TAGLINE BAR VARIANT: 'ticker' (2026-10-14). The site's tagline on a band in the button colour (--cta, the owner's brand fill), its phrases ("a · b · c", the same
// separator the footer line uses) spread across the width in small tracked capitals with a mark between them; a
// tagline without the separator shows as one phrase. Self-omits when the site has no tagline, like the default bar.
export function TaglineBarTickerBlock({ site = SITE }: { site?: typeof SITE }) {
  if (!hasText(site.tagline)) return null
  const phrases = site.tagline.split('·').map((s) => s.trim()).filter(Boolean)
  return (
    <section className="bg-cta text-cta-foreground" data-tagline="ticker">
      {/* a phone stacks the phrases; from a tablet up they share one line with the mark between them */}
      <div className="container-x flex flex-col items-center gap-y-2 py-5 sm:flex-row sm:justify-around sm:gap-x-6">
        {phrases.map((p, i) => (
          <span key={i} className="contents">
            {i > 0 && <Asterisk aria-hidden="true" className="hidden h-3.5 w-3.5 shrink-0 sm:block" />}
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] sm:text-xs">{p}</span>
          </span>
        ))}
      </div>
    </section>
  )
}
