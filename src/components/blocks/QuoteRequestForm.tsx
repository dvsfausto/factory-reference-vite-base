import { useEffect, useState, type FormEvent } from 'react'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { useCatalogServices } from '~/lib/useCatalogServices'
import { submitQuoteRequest, type LeadStatus } from './forms-submit'
import { Field, Textarea, SubmitButton, SuccessCard } from './form-ui'
import { hasPhone } from '~/lib/phone'

// The ONE quote-request form (niche arc Stage 4, 2026-09-08). Extracted from FormQuoteBlock so the
// 'estimate' hero can carry the same form: the same fields, the same live read of the owner's quotable
// services, the same request-quote envelope (first/last/phone/email/serviceId/serviceName/details/hp),
// the same honeypot. FormQuoteBlock renders it inside its section card with `compact` off — that markup
// is byte-for-byte what the block rendered before the extraction. `compact` (the hero) tightens the
// spacing, drops the "Or call" line (the hero's copy column carries the phone) and shortens the details
// field; it never changes a field name or the submit path.
export type QuoteFormCopy = {
  detailsLabel?: string
  detailsPlaceholder?: string
  body?: string
  heading?: string
  eyebrow?: string
  submitLabel?: string
}

export function readQuoteFormCopy(site: typeof SITE): QuoteFormCopy | undefined {
  // Cast-read so a generated SITE without the field still type-checks; empty → tr() fallback.
  return (site as { quoteForm?: QuoteFormCopy }).quoteForm
}

export function QuoteRequestForm({
  site = SITE,
  services,
  submitLabel,
  compact = false,
}: {
  site?: typeof SITE
  /** Owner-chosen quotable services (editable); absent → a LIVE read of the business's quotable services. */
  services?: { slug: string; name: string; id?: string }[]
  submitLabel?: string
  compact?: boolean
}) {
  const [status, setStatus] = useState<LeadStatus>('idle')
  // /quote?service=<slug> (a service page's own "Get a quote"): preselect it. Set after mount so the
  // server-rendered markup stays identical (no hydration mismatch).
  const [preselected, setPreselected] = useState<string>('')
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('service')
    if (p) setPreselected(p)
  }, [])
  const [error, setError] = useState<string | null>(null)

  const quoteForm = readQuoteFormCopy(site)
  const submitText = submitLabel ?? quoteForm?.submitLabel ?? tr('form.requestMyQuote')

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

  if (status === 'success') {
    return <SuccessCard title={tr('form.quoteSuccessTitle')} body={tr('form.quoteSuccessBody')} />
  }

  const gap = compact ? 'mt-4' : 'mt-5'
  return (
    <form onSubmit={onSubmit}>
      <div className={compact ? 'grid gap-4 md:grid-cols-2' : 'grid gap-5 md:grid-cols-2'}>
        <Field label={tr('form.firstName')} name="first_name" required autoComplete="given-name" />
        <Field label={tr('form.lastName')} name="last_name" required autoComplete="family-name" />
        <Field label={tr('form.phone')} name="phone" type="tel" required autoComplete="tel" />
        <Field label={tr('form.email')} name="email" type="email" autoComplete="email" />
      </div>
      {options.length > 0 && (
        <div className={gap}>
          <label htmlFor="quote-service" className="block text-sm font-medium text-ink-800">{tr('form.serviceNeeded')}</label>
          <select
            id="quote-service"
            name="service"
            key={preselected || 'none'}
            defaultValue={preselected || (options.length === 1 ? options[0].slug : '')}
            className="mt-1.5 w-full rounded-xl border border-[#D5D9DF] bg-white px-4 py-3 text-ink-900 outline-none focus:border-fam-accent focus:ring-2 focus:ring-fam-accent-soft-2"
          >
            {options.length !== 1 && <option value="">Select a service…</option>}
            {options.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className={gap}>
        <Textarea
          label={quoteForm?.detailsLabel || tr('form.projectDetails')}
          name="details"
          required
          rows={compact ? 3 : 5}
          placeholder={quoteForm?.detailsPlaceholder || tr('form.phQuote')}
        />
      </div>
      {/* Honeypot: hidden from humans, tempting to bots. request-quote silently drops when filled. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>{tr('form.companyWebsite')}<input type="text" name="company_site" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {status === 'error' && error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <div className={compact ? 'mt-6 flex flex-wrap items-center gap-4' : 'mt-8 flex flex-wrap items-center gap-4'}>
        <SubmitButton status={status} label={submitText} />
        {!compact && hasPhone(site.phone) && (<span className="text-sm text-fam-ink-muted">
          Or call{' '}
          <a href={`tel:${site.phone}`} className="font-medium text-fam-accent-text-strong underline-offset-2 hover:underline">
            {site.phoneDisplay}
          </a>
        </span>)}
      </div>
    </form>
  )
}
