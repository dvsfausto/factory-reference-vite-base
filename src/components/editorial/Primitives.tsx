import type { ReactNode } from 'react'
import { ARROW, splitHeading } from '~/lib/editorial'

/* The Editorial look's shared pieces. Every colour is a family token (the theme sets the fam-* values); every string a
   caller passes already went through tr() or is owner copy. */

/** Small caps, tracked, muted: "THE EXPERIENCE". */
export function Kicker({ children, onDark = false, className = '' }: { children: ReactNode; onDark?: boolean; className?: string }) {
  return <p className={`font-sans text-[11px] font-medium uppercase tracking-[0.18em] ${onDark ? 'text-fam-on-statement-muted' : 'text-fam-ink-muted'} ${className}`}>{children}</p>
}

/** A serif heading whose second sentence is set in italic gold: "Exceptional photography." / "Effortless experience." */
export function EditorialHeading({ text, as: Tag = 'h2', size = 'lg', onDark = false, className = '' }: { text: string; as?: 'h1' | 'h2' | 'h3'; size?: 'xl' | 'lg' | 'md' | 'sm'; onDark?: boolean; className?: string }) {
  const { first, second } = splitHeading(text)
  const sizes = { xl: 'text-5xl sm:text-6xl lg:text-7xl', lg: 'text-4xl sm:text-5xl lg:text-6xl', md: 'text-3xl sm:text-4xl lg:text-5xl', sm: 'text-2xl sm:text-3xl' }[size]
  return (
    <Tag className={`font-display font-normal leading-[1.02] tracking-[-0.01em] ${sizes} ${onDark ? 'text-fam-on-statement' : 'text-fam-ink'} ${className}`} style={{ textWrap: 'balance' } as React.CSSProperties}>
      {first}
      {second ? (
        <>
          <br />
          <em className={`not-italic font-display italic ${onDark ? 'text-fam-accent-tint' : 'text-fam-accent-text'}`}>{second}</em>
        </>
      ) : null}
    </Tag>
  )
}

/** Square, uppercase, tracked, with the arrow. `tone`: dark on a light band, light on a dark band, or a plain underlined text link. */
export function EditorialButton({ href, children, tone = 'dark', className = '', external = false }: { href: string; children: ReactNode; tone?: 'dark' | 'light' | 'link'; className?: string; external?: boolean }) {
  const base = 'inline-flex items-center gap-3 font-sans text-[12px] font-medium uppercase tracking-[0.14em] transition-colors'
  const tones = {
    dark: 'bg-fam-ink px-6 py-4 text-fam-page hover:bg-fam-ink-muted',
    light: 'bg-fam-page px-6 py-4 text-fam-ink hover:bg-fam-surface-2',
    link: 'border-b border-current pb-1 text-current',
  }[tone]
  const rel = external ? 'noopener' : undefined
  return (
    <a href={href} className={`${base} ${tones} ${className}`} target={external ? '_blank' : undefined} rel={rel}>
      <span>{children}</span>
      <span aria-hidden="true" className="text-[13px]">{ARROW}</span>
    </a>
  )
}

/** A thin rule in the band's own hairline colour. */
export function Rule({ onDark = false, className = '' }: { onDark?: boolean; className?: string }) {
  return <hr className={`border-0 border-t ${onDark ? 'border-fam-statement-hairline' : 'border-fam-hairline'} ${className}`} />
}

/** "01", small, gold, tracked. */
export function Numeral({ n, className = '' }: { n: number; className?: string }) {
  return <span className={`font-sans text-[11px] tracking-[0.14em] text-fam-accent-text ${className}`}>{String(n).padStart(2, '0')}</span>
}
