import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { PrimaryCta } from '~/components/blocks/PrimaryCta'
import { ARROW } from '~/lib/editorial'

/* The Editorial button, routed. Primitives.tsx EditorialButton is a plain <a> (right for an owner link or a hash);
   these two carry the same look over the template's own targets: the primary CTA through PrimaryCta (the ONE resolver
   of the front door, /#book vs /quote vs /contact vs an owner link) and an inner page through the router Link, so the
   site stays a single-page app. Same classes as EditorialButton, tone for tone. */

export type EditorialTone = 'dark' | 'light' | 'link'

export function editorialButtonClass(tone: EditorialTone, className = ''): string {
  const base = 'inline-flex items-center gap-3 font-sans text-[12px] font-medium uppercase tracking-[0.14em] transition-colors'
  const tones = {
    dark: 'bg-fam-ink px-6 py-4 text-fam-page hover:bg-fam-ink-muted',
    light: 'bg-fam-page px-6 py-4 text-fam-ink hover:bg-fam-surface-2',
    link: 'border-b border-current pb-1 text-current',
  }[tone]
  return `${base} ${tones} ${className}`
}

export function EditorialArrow() {
  return <span aria-hidden="true" className="text-[13px]">{ARROW}</span>
}

/** The site's primary call to action in the Editorial dress. `to` omitted = the affordance target. */
export function EditorialPrimaryCta({ to, tone = 'dark', className = '', children }: { to?: string; tone?: EditorialTone; className?: string; children: ReactNode }) {
  return (
    <PrimaryCta to={to} className={editorialButtonClass(tone, className)}>
      <span>{children}</span>
      <EditorialArrow />
    </PrimaryCta>
  )
}

/** An inner-page link (router) in the Editorial dress. */
export function EditorialLink({ to, tone = 'link', className = '', children }: { to: string; tone?: EditorialTone; className?: string; children: ReactNode }) {
  return (
    <Link to={to} className={editorialButtonClass(tone, className)}>
      <span>{children}</span>
      <EditorialArrow />
    </Link>
  )
}
