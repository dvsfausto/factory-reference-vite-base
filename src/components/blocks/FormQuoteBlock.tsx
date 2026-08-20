import { useState, type FormEvent } from 'react'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { useCatalogServices } from '~/lib/useCatalogServices'
import { submitQuoteRequest, type LeadStatus } from './forms-submit'
import { Field, Textarea, SubmitButton, SuccessCard } from './form-ui'

// Forms LAYOUT: 'quote', the CATALOG quote-request widget (the pattern booking/cart copy). It lists
// only the owner's QUOTABLE services (services.action === 'quote', forwarded by the scaffolder) and
// files a STRUCTURED quote_request via request-quote → the owner's Requests tab (not a generic lead).
//
// EDITABLE surface = block params (heading/body/label/submitLabel/services). On the /quote customPage
// these ride in design_dna.customPages → the owner edits them AND they survive a rebuild. `services`
// lets the owner choose which quotable services appear; absent → all quotable (never a dead form).
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA). Radius -> rounded-* (DNA).
// Font -> font-display (DNA). Dark header panel component-owned. Never bg-brand-* / .btn.
export function FormQuoteBlock({
  label = tr('form.freeQuote'),
  heading = tr('form.requestQuote'),
  body,
  submitLabel = tr('form.requestMyQuote'),
  services,
}: {
  label?: string
  heading?: string
  body?: string
  submitLabel?: string
  services?: { slug: string; name: string; id?: string }[]
}) {
  const [status, setStatus] = useState<LeadStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  // Industry-aware details copy (emitted from the homepage-copy wave when it produced trade-specific
  // guidance). Cast-read so a generated SITE without the field still type-checks; empty → tr() fallback.
  const quoteForm = (SITE as { quoteForm?: { detailsLabel?: string; detailsPlaceholder?: string; body?: string } }).quoteForm
  // Precedence: an explicit param (owner / customPage) > the trade-specific body from the copy wave > tr().
  const bodyText = body ?? quoteForm?.body ?? tr('form.quoteBody')

  // The quotable services to offer: the block's own list (owner-chosen, editable) → else a LIVE read of
  // the business's quotable services (SSR = baked for SEO/instant; client reconciles so a service added
  // after the build shows with no rebuild; failure → baked). Options keyed by slug; submitted by id.
  const liveServices = useCatalogServices(['collect', 'quote'])
  const options = services && services.length > 0 ? services : liveServices

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    setStatus('submitting')
    setError(null)
    const serviceSlug = String(fd.get('service') ?? '').trim()
    const selected = options.find((s) => s.slug === serviceSlug)
    try {
      await submitQuoteRequest({
        first_name: String(fd.get('first_name') ?? ''),
        last_name: String(fd.get('last_name') ?? ''),
        phone: String(fd.get('phone') ?? ''),
        email: String(fd.get('email') ?? '') || undefined,
        serviceId: selected?.id,
        serviceName: selected?.name,
        details: String(fd.get('details') ?? ''),
        hp: String(fd.get('company_site') ?? ''),
      })
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : tr('form.somethingWrong'))
    }
  }

  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#E6E8EC] bg-white shadow-sm">
          <div className="bg-slate-950 px-8 py-10 text-white md:px-12">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{heading}</h2>
            {bodyText && <p className="mt-3 max-w-xl leading-relaxed text-slate-300">{bodyText}</p>}
          </div>

          <div className="p-8 md:p-12">
            {status === 'success' ? (
              <SuccessCard
                title={tr('form.quoteSuccessTitle')}
                body={tr('form.quoteSuccessBody')}
              />
            ) : (
              <form onSubmit={onSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label={tr('form.firstName')} name="first_name" required autoComplete="given-name" />
                  <Field label={tr('form.lastName')} name="last_name" required autoComplete="family-name" />
                  <Field label={tr('form.phone')} name="phone" type="tel" required autoComplete="tel" />
                  <Field label={tr('form.email')} name="email" type="email" autoComplete="email" />
                </div>
                {options.length > 0 && (
                  <div className="mt-5">
                    <label htmlFor="quote-service" className="block text-sm font-medium text-ink-800">{tr('form.serviceNeeded')}</label>
                    <select
                      id="quote-service"
                      name="service"
                      defaultValue={options.length === 1 ? options[0].slug : ''}
                      className="mt-1.5 w-full rounded-xl border border-[#D5D9DF] bg-white px-4 py-3 text-ink-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    >
                      {options.length !== 1 && <option value="">Select a service…</option>}
                      {options.map((s) => (
                        <option key={s.slug} value={s.slug}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="mt-5">
                  <Textarea
                    label={quoteForm?.detailsLabel || tr('form.projectDetails')}
                    name="details"
                    required
                    rows={5}
                    placeholder={quoteForm?.detailsPlaceholder || tr('form.phQuote')}
                  />
                </div>
                {/* Honeypot: hidden from humans, tempting to bots. request-quote silently drops when filled. */}
                <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                  <label>{tr('form.companyWebsite')}<input type="text" name="company_site" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                {status === 'error' && error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <SubmitButton status={status} label={submitLabel} />
                  <span className="text-sm text-[#64748B]">
                    Or call{' '}
                    <a href={`tel:${SITE.phone}`} className="font-medium text-emerald-700 underline-offset-2 hover:underline">
                      {SITE.phoneDisplay}
                    </a>
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
