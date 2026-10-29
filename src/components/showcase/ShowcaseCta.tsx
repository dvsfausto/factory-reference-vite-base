import type { ReactNode } from 'react'
import { PrimaryCta } from '~/components/blocks/PrimaryCta'

/* The Showcase button (2026-10-29): square, flat, small tracked caps. 'ink' on the white page, 'light' over a photo,
   'outline' for the quiet header button. The target is the ONE primary-CTA resolver (PrimaryCta) unless `to` is given. */
export type ShowcaseTone = 'ink' | 'light' | 'outline'

export function showcaseButtonClass(tone: ShowcaseTone, className = ''): string {
  const base = 'inline-flex items-center justify-center font-sans text-[12px] font-medium uppercase tracking-[0.18em] transition-colors focus-ring'
  const tones = {
    ink: 'bg-fam-ink px-8 py-4 text-fam-page hover:bg-fam-ink-muted',
    light: 'bg-fam-page px-8 py-4 text-fam-ink hover:bg-fam-surface-2',
    outline: 'border border-fam-ink px-5 py-2.5 text-fam-ink hover:bg-fam-ink hover:text-fam-page',
  }[tone]
  return `${base} ${tones} ${className}`
}

export function ShowcaseCta({ to, tone = 'ink', className = '', children }: { to?: string; tone?: ShowcaseTone; className?: string; children: ReactNode }) {
  return (
    <PrimaryCta to={to} className={showcaseButtonClass(tone, className)}>
      {children}
    </PrimaryCta>
  )
}
