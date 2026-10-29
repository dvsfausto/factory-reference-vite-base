import type { ElementType, ReactNode } from 'react'
import { goldParts, plainText } from '~/lib/showcase'

/* The Showcase look's small parts (2026-10-29): the gold-word headline, the gold-bordered label chip, the spaced capitals,
   the gold diamond. Every colour a fam-* token, so the theme decides the gold. */

export const CAPS = 'font-sans text-[11px] font-medium uppercase tracking-[0.28em]'

/** A headline with its gold word (see lib/showcase goldParts). Uppercase display serif; the plain words are its accessible name. */
export function GoldHeading({ as: Tag = 'h2', text, className = '', onDark = false }: { as?: ElementType; text: string; className?: string; onDark?: boolean }) {
  const parts = goldParts(text)
  if (parts.length === 0) return null
  return (
    <Tag className={`font-display font-normal uppercase leading-[1.05] tracking-[0.02em] ${onDark ? 'text-fam-on-statement' : 'text-fam-ink'} ${className}`} aria-label={plainText(text)}>
      {parts.map((p, i) => (
        <span key={i} aria-hidden="true" className={p.gold ? (onDark ? 'text-fam-accent-tint' : 'text-fam-accent-text') : undefined}>{p.text}</span>
      ))}
    </Tag>
  )
}

/** The small gold-bordered label ("BRIDAL COLLECTION"). */
export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-block border border-fam-accent px-4 py-2 ${CAPS} text-fam-accent-text ${className}`}>{children}</span>
}

/** A small gold diamond, the look's one mark. */
export function Diamond({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block h-1.5 w-1.5 rotate-45 bg-fam-accent ${className}`} />
}

/** A short gold hairline. */
export function GoldRule({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`block h-px w-12 bg-fam-accent ${className}`} />
}
