import { ShieldCheck, Clock, Heart, Award, BadgeCheck, Star, type LucideIcon } from 'lucide-react'
import { factIcon } from '~/lib/fact-icons'

// TrustBar LAYOUT: 'logo-strip', a compact, monochrome single-row strip of trust
// marks, the "trusted / certified by" bar pattern. Character-agnostic. Quiet and
// horizontal by design: it reassures without shouting, sitting between louder
// sections.
//
// Logos are DATA and OPTIONAL: each item may carry a `logo` (image URL) read via
// inline cast (the SITE.surface / hero video_url precedent). The data/types files
// stay untouched; when an item has no logo the mark GRACEFULLY falls back to a
// fixed line-icon plus the title as a monochrome badge, a clean text strip rather
// than a broken image.
//
// TOKEN DISCIPLINE: accent -> fam-accent-* (DNA) restricted to 50/100/600/700:
// fam-accent icon. Radius -> rounded-* (DNA). Font -> font-display (DNA). Cool
// light surface component-owned (white / slate / hairline #E6E8EC). No CTA by
// design. Never bg-brand-* / .btn.
//
// Prop signature identical to TrustBarBlock; returns an Element (no null).
const ICONS: LucideIcon[] = [ShieldCheck, Award, BadgeCheck, Star, Clock, Heart]

export function TrustBarLogoStripBlock({
  items = [],
}: {
  items?: { title: string; description: string; kind?: string | null }[]
}) {
  if (!items.length) return null // no trust facts → no section; never an invented one (niche arc 2b)
  return (
    <section className="border-y border-fam-hairline bg-fam-card">
      <div className="container-x py-band">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:justify-between">
          {items.map((item, i) => {
            const logo = (item as { logo?: string }).logo
            const Icon = factIcon(item)
            return logo ? (
              <img
                key={i}
                src={logo}
                alt={item.title}
                loading="lazy"
                className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
              />
            ) : (
              <span
                key={i}
                className="inline-flex items-center gap-2.5 font-display text-sm font-semibold uppercase tracking-[0.12em] text-fam-ink-muted"
              >
                {Icon && <Icon className="h-5 w-5 text-fam-accent-text" strokeWidth={1.75} />}
                {item.title}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
