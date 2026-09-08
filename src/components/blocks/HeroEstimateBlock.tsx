import { tr } from '~/lib/i18n'
import { motion } from 'framer-motion'
import { Check, Phone } from 'lucide-react'
import { SITE } from '~/data/site'
import { hasPhone } from '~/lib/phone'
import { QuoteRequestForm, readQuoteFormCopy } from './QuoteRequestForm'

// Hero LAYOUT: 'estimate' (niche arc Stage 4, 2026-09-08) — the estimate form IN the hero. The
// Instant Estimate and Logistics Quote templates lead with the form: headline, body and trust row on
// the left, the quote-request card on the right. The card is the ONE quote form (QuoteRequestForm,
// shared with the 'quote' forms block): the same fields, the same live read of the owner's quotable
// services, the same request-quote envelope. No photo: the form is what this hero leads with.
//
// Copy: the hero's own fields (SITE.hero.*) on the left; the card's eyebrow/heading/body/submit read
// SITE.quoteForm.* (the copy wave's trade-language quote copy, editable through the forms row) with the
// tr() fallbacks the quote block uses. The card heading is an h2 — the page's one h1 is the headline.
//
// Never null: a hero always renders. With no quotable services the card still renders (the service
// select hides, as in the quote block) — an estimate request without a service is still a request.
//
// TOKEN DISCIPLINE: CTA -> bg-cta / text-cta-foreground (through SubmitButton). Accent -> fam-accent-*
// (DNA). Surfaces -> fam-surface / bg-white. Radius -> rounded-* (DNA). Font -> font-display (DNA).
// Same motion as the split heroes (one 0.5 s rise per column), so the page reads as one piece.
//
// Props identical to HeroBlock; decorativeAsset accepted for parity but unused.
export function HeroEstimateBlock({
  site = SITE,
  trustItems = [tr('trust.freeEstimates'), tr('trust.onSchedule'), tr('trust.localTeam'), tr('trust.satisfactionGuaranteed')],
}: {
  site?: typeof SITE
  trustItems?: string[]
  decorativeAsset?: string
}) {
  const quoteForm = readQuoteFormCopy(site)
  const eyebrowText = quoteForm?.eyebrow ?? tr('form.freeQuote')
  const headingText = quoteForm?.heading ?? tr('form.requestQuote')
  const bodyText = quoteForm?.body ?? tr('form.quoteBody')

  return (
    <section className="bg-fam-surface">
      <div className="container-x py-section">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
              <span className="h-px w-6 bg-fam-accent" />
              {site.hero.kicker}
            </span>

            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-fam-ink sm:text-6xl">
              {site.hero.headline}
            </h1>

            {site.hero.subheadline && (
              <p className="mt-5 text-xl leading-relaxed text-fam-ink-muted">
                {site.hero.subheadline}
              </p>
            )}

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fam-ink-muted">
              {site.hero.body}
            </p>

            {hasPhone(site.phone) && (
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex h-[52px] items-center gap-2 rounded-xl border border-fam-hairline bg-white px-6 font-display font-semibold text-fam-ink transition-colors hover:border-fam-accent hover:text-fam-accent-text-strong"
                >
                  <Phone className="h-4 w-4 text-fam-accent-text" /> {site.phoneDisplay}
                </a>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fam-ink-muted">
              {trustItems.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-fam-accent-text" /> {t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div aria-hidden="true" className="absolute -inset-4 -z-10 rounded-[2rem] bg-fam-accent-soft blur-2xl" />
            <div className="relative rounded-3xl border border-fam-hairline bg-white p-6 shadow-sm md:p-8">
              <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
                <span className="h-px w-6 bg-fam-accent" />
                {eyebrowText}
              </span>
              <h2 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-3xl">
                {headingText}
              </h2>
              {bodyText && <p className="mt-2 text-sm leading-relaxed text-fam-ink-muted">{bodyText}</p>}
              <div className="mt-6">
                <QuoteRequestForm site={site} compact />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
