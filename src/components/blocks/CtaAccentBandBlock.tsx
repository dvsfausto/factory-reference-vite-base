import { ArrowUpRight } from 'lucide-react'
import { SITE } from '~/data/site'
import { hasText } from '~/lib/has-text'
import { primaryCta } from '~/lib/primaryCta'
import { PrimaryCta } from './PrimaryCta'

// CTA LAYOUT: 'accent-band' (2026-10-14). The closing band in the accent colour: a small tracked line (the block's
// label) over a very large uppercase title, the subtitle under it, and the affordance button in the page's own tone,
// all centred. Title/subtitle = the block's params, else the site's closing words; label only when set.
export function CtaAccentBandBlock({
  site = SITE,
  title,
  subtitle,
  label,
}: {
  site?: typeof SITE
  title?: string
  subtitle?: string
  label?: string
}) {
  const home = (site as { homeCta?: { title?: string; subtitle?: string } }).homeCta
  const t = title ?? home?.title
  const sub = subtitle ?? home?.subtitle
  const cta = primaryCta()
  if (!hasText(t)) return null
  return (
    <section className="bg-fam-accent text-fam-on-accent" data-block="cta" data-variant="accent-band">
      <div className="container-x py-section text-center">
        {hasText(label) && <p className="text-[11px] font-bold uppercase tracking-[0.2em]">{label}</p>}
        <h2 style={{ color: 'inherit' }} className="mx-auto mt-4 max-w-[16ch] font-display text-[clamp(2.6rem,6vw,4.9rem)] font-bold uppercase leading-[0.95] tracking-[-0.01em]">{t}</h2>
        {hasText(sub) && <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed">{sub}</p>}
        <PrimaryCta className="mt-8 inline-flex items-center gap-7 bg-fam-page px-6 py-4 text-sm font-bold text-fam-ink transition-[filter] hover:brightness-(--hov-shade)">
          {cta.label}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </PrimaryCta>
      </div>
    </section>
  )
}
