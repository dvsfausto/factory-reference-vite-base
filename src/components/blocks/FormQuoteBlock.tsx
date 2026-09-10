import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { QuoteRequestForm, readQuoteFormCopy } from './QuoteRequestForm'

// Forms LAYOUT: 'quote', the CATALOG quote-request widget (the pattern booking/cart copy). It lists
// only the owner's QUOTABLE services (services.action === 'quote', forwarded by the scaffolder) and
// files a STRUCTURED quote_request via request-quote → the owner's Requests tab (not a generic lead).
//
// EDITABLE surface = block params (heading/body/label/submitLabel/services). On the /quote customPage
// these ride in design_dna.customPages → the owner edits them AND they survive a rebuild. `services`
// lets the owner choose which quotable services appear; absent → all quotable (never a dead form).
//
// The form itself (fields, live services, envelope) is QuoteRequestForm, shared with the 'estimate'
// hero (niche arc Stage 4); this block owns the section, the card and the dark header panel.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> fam-accent-* (DNA). Radius -> rounded-* (DNA).
// Font -> font-display (DNA). Dark header panel component-owned. Never bg-brand-* / .btn.
export function FormQuoteBlock({
  site = SITE,
  label,
  heading,
  headingLevel = 2,
  body,
  submitLabel,
  services,
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  /** 1 when this block is the page title (a custom page whose layout has no `intro` block). */
  headingLevel?: 1 | 2
  body?: string
  submitLabel?: string
  services?: { slug: string; name: string; id?: string }[]
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  // ONE TRADE SOURCE for the whole form. The copy wave emits SITE.quoteForm.{eyebrow,heading,body,
  // submitLabel} in the trade's language so the eyebrow, heading, body AND submit button all speak it,
  // instead of four scattered contractor strings ("FREE QUOTE" / "Request my quote"). Owner/customPage param wins.
  const quoteForm = readQuoteFormCopy(site)
  const bodyText = body ?? quoteForm?.body ?? tr('form.quoteBody')
  const headingText = heading ?? quoteForm?.heading ?? tr('form.requestQuote')
  const eyebrowText = label ?? quoteForm?.eyebrow ?? tr('form.freeQuote')

  return (
    <section className="bg-fam-card">
      <div className="container-x py-section">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-fam-hairline bg-fam-card shadow-(--elev-1)">
          <div className="bg-fam-panel px-8 py-10 text-fam-on-dark md:px-12">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-on-dark">
              <span className="h-px w-6 bg-fam-accent" />
              {eyebrowText}
            </span>
            <Heading className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{headingText}</Heading>
            {bodyText && <p className="mt-3 max-w-xl leading-relaxed text-slate-300">{bodyText}</p>}
          </div>

          <div className="p-8 md:p-12">
            <QuoteRequestForm site={site} services={services} submitLabel={submitLabel} />
          </div>
        </div>
      </div>
    </section>
  )
}
