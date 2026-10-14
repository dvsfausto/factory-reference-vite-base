import { ArrowUpRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { paragraphs } from '~/lib/paragraphs'
import { hasText } from '~/lib/has-text'
import { INVERSE_GROUND, INVERSE_LINE, INVERSE_MUTED } from '~/lib/inverse-tone'

// richText LAYOUT: 'statement' (2026-10-14). A band in the inverse tone: the eyebrow and a large heading on the left,
// the body's paragraphs on the right, and one text link under them when the block has a button label (an https
// button address opens it in a new tab; without one it goes to the About page, the owner's own story). Text = the
// block's params only; nothing without a heading or a body.
export function RichTextStatementBlock({
  eyebrow,
  heading,
  body,
  buttonLabel,
  buttonHref,
  headingLevel = 2,
}: {
  eyebrow?: string
  heading?: string
  body?: string
  buttonLabel?: string
  buttonHref?: string
  headingLevel?: 1 | 2
}) {
  const paras = paragraphs(body)
  if (!hasText(heading) && paras.length === 0) return null
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  const https = hasText(buttonHref) && /^https:\/\//i.test(buttonHref.trim())
  const linkClass = 'mt-4 inline-flex items-center gap-4 border-b pb-3 text-xs font-bold'
  return (
    <section style={INVERSE_GROUND} data-block="richText" data-variant="statement">
      <div className="container-x grid gap-10 py-section lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-[12%]">
        <div>
          {hasText(eyebrow) && <p className="text-[11px] font-bold uppercase tracking-[0.2em]">{eyebrow}</p>}
          {hasText(heading) && (
            <Heading style={{ color: 'inherit' }} className="mt-4 font-display text-[clamp(2.4rem,4.6vw,4.1rem)] font-bold leading-[1.06] tracking-[-0.01em]">
              {heading}
            </Heading>
          )}
        </div>
        <div>
          {paras.map((p, i) => (
            <p key={i} style={INVERSE_MUTED} className="mt-4 text-base leading-[1.8] first:mt-0">{p}</p>
          ))}
          {hasText(buttonLabel) && (
            https ? (
              <a href={buttonHref!.trim()} target="_blank" rel="noopener noreferrer" className={linkClass} style={{ borderColor: INVERSE_LINE }}>
                {buttonLabel}
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            ) : (
              <Link to="/about" className={linkClass} style={{ borderColor: INVERSE_LINE }}>
                {buttonLabel}
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  )
}
