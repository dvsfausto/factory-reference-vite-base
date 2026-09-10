import { Link } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Star,
  Leaf,
  Wrench,
  Heart,
  Home,
  type LucideIcon,
} from 'lucide-react'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services-view'

// ServicesPreview LAYOUT: 'icon-tiles', icon + title + blurb tiles, NO photos.
// The right call when a business has no service imagery: an intentional icon
// treatment carries each tile instead of a missing or generic stock photo.
// Character-agnostic.
//
// Intentional icons (not grid-minus-photos): each icon sits in a soft emerald
// chip, sized and aligned deliberately. The icon is DATA-DRIVEN and optional -
// read from (s as { icon? }) via inline cast (the SITE.surface / video_url
// precedent), looked up in a small allowlist, and falling back to a deterministic
// per-position default when absent or unknown. The data file stays untouched and
// every existing service renders a sensible icon.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary / text-primary-foreground (BRAND-
// owned). Accent -> fam-accent-* (DNA) restricted to 50/100/600/700: fam-accent-soft chip,
// fam-accent icon/accent. Radius -> rounded-* (DNA). Font -> font-display (DNA).
// Light surface component-owned (white / slate / border #E6E8EC). Never
// bg-brand-* / .btn.
//
// Identity copy read from SITE.homeServices via inline cast. Prop signature
// identical to ServicesPreviewBlock; returns Element | null.
const ICON_BY_NAME: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  shield: ShieldCheck,
  clock: Clock,
  star: Star,
  leaf: Leaf,
  wrench: Wrench,
  heart: Heart,
  home: Home,
}
const DEFAULT_ICONS: LucideIcon[] = [Sparkles, ShieldCheck, Leaf, Star, Clock, Wrench]

export function ServicesIconTilesBlock({
  site = SITE,
  services = SERVICES,
  label,
  heading,
  body,
  exploreLabel = tr('common.learnMore'),
  moreLink = tr('common.allServices'),
}: {
  site?: typeof SITE
  services?: typeof SERVICES
  label?: string
  heading?: string
  scriptAccent?: string
  body?: string
  exploreLabel?: string
  moreLink?: string
}) {
  const hs = (site as { homeServices?: { label?: string; heading?: string; body?: string } }).homeServices
  const tiles = services.slice(0, 6)
  if (tiles.length === 0) return null
  return (
    <section className="bg-fam-surface-2">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label ?? hs?.label ?? 'Our services'}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading ?? hs?.heading ?? 'What we do'}
          </h2>
          {(body ?? hs?.body) && (
            <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body ?? hs?.body}</p>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((s, i) => {
            const iconName = (s as { icon?: string }).icon
            const Icon: LucideIcon =
              (iconName ? ICON_BY_NAME[iconName] : undefined) ?? DEFAULT_ICONS[i % DEFAULT_ICONS.length]!
            return (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex flex-col rounded-2xl border border-fam-hairline bg-fam-card p-7 transition-all hover:border-fam-accent hover:shadow-(--elev-2)"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-fam-accent-soft text-fam-accent-text transition-colors group-hover:bg-fam-accent-soft-2">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-fam-ink">
                  {s.displayName}
                </h3>
                <p className="mt-2 flex-1 text-fam-ink-muted">{s.short}</p>
                <span className="mt-6 inline-flex items-center gap-1 font-display text-sm font-semibold text-fam-accent-text transition-all group-hover:gap-2">
                  {exploreLabel} <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            )
          })}
        </div>

        {services.length > tiles.length && (
          <div className="mt-12">
            <Link
              to="/services"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-cta px-7 font-display text-sm font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade)"
            >
              {moreLink} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
