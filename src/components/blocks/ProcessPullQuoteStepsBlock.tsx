import type { ProcessStep } from './process-variants'
import { tr } from '~/lib/i18n'
import { Kicker, Numeral, Rule, EditorialButton } from '~/components/editorial/Primitives'
import { SITE } from '~/data/site'

// Process LAYOUT: 'pull-quote-steps' (the Editorial theme, ZB-147 W1.2). A kicker, an optional large serif pull
// quote (the block's `quote` param, else its `heading` param; nothing when neither is set, the template never
// invents a sentence), then the steps as four hairline-topped columns: numeral, serif title, muted text. An
// EditorialButton closes it when the block carries a `ctaLabel` param.
//
// OMIT-WHEN-ABSENT: steps read from optional SITE.steps via cast; no steps -> null, like every process layout.
// Every colour a fam-* token. No motion.
export function ProcessPullQuoteStepsBlock({
  site = SITE,
  label,
  heading,
  quote,
  ctaLabel,
  ctaHref = '/contact',
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
  quote?: string
  ctaLabel?: string
  ctaHref?: string
}) {
  const steps = (site as { steps?: ProcessStep[] }).steps
  if (!steps || steps.length === 0) return null
  const pull = (quote ?? heading ?? '').trim()
  return (
    <section className="bg-fam-page">
      <div className="container-x py-section">
        <Kicker>{label ?? tr('editorial.processKicker')}</Kicker>
        {pull && (
          <blockquote className="mt-8 max-w-[18ch] font-display font-normal leading-[1.05] tracking-[-0.01em] text-fam-ink text-[36px] md:text-[56px]" style={{ textWrap: 'balance' } as React.CSSProperties}>
            {`“${pull}”`}
          </blockquote>
        )}
        <ol className="mt-14 grid list-none grid-cols-2 gap-8 p-0 m-0 lg:grid-cols-4">
          {steps.slice(0, 4).map((s, i) => (
            <li key={`${s.title}-${i}`} className="flex flex-col">
              <Rule />
              <Numeral n={i + 1} className="mt-5" />
              <h3 className="mt-4 font-display font-normal leading-[1.1] tracking-[-0.01em] text-fam-ink text-[28px]">{s.title}</h3>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-fam-ink-muted">{s.description}</p>
            </li>
          ))}
        </ol>
        {ctaLabel && (
          <div className="mt-14">
            <EditorialButton href={ctaHref} tone="dark">{ctaLabel}</EditorialButton>
          </div>
        )}
      </div>
    </section>
  )
}
