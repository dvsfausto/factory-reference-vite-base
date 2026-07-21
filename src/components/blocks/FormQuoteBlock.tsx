import { useState, type FormEvent } from 'react'
import { SITE } from '~/data/site'
import { submitLead, type LeadStatus } from './forms-submit'
import { Field, Textarea, SubmitButton, SuccessCard } from './form-ui'

// Forms LAYOUT: 'quote' — a "request a quote" form with a service-of-interest
// field. Character-agnostic. Posts the confirmed handle-website-lead envelope
// (source_page 'quote'); the service is FOLDED INTO message (no new payload keys).
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700. Radius -> rounded-* (DNA). Font -> font-display (DNA). Dark
// header panel (slate-950) component-owned. Never bg-brand-* / .btn.
export function FormQuoteBlock({
  label = (SITE as { ctaLabel?: string }).ctaLabel ?? 'Free quote',
  heading = (SITE as { ctaLabel?: string }).ctaLabel ? 'Tell us what you need' : 'Request a quote',
  body = (SITE as { ctaLabel?: string }).ctaLabel
    ? "Tell us what you need and we'll respond within one business day."
    : 'Tell us about the project and we respond within one business day.',
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const [status, setStatus] = useState<LeadStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    setStatus('submitting')
    setError(null)
    const service = String(fd.get('service') ?? '').trim()
    const note = String(fd.get('message') ?? '').trim()
    const message = [service && `Service of interest: ${service}`, note && `\n${note}`].filter(Boolean).join('\n')
    try {
      await submitLead(
        {
          first_name: String(fd.get('first_name') ?? ''),
          last_name: String(fd.get('last_name') ?? ''),
          phone: String(fd.get('phone') ?? ''),
          email: String(fd.get('email') ?? '') || undefined,
          message,
        },
        'quote',
      )
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
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
            {body && <p className="mt-3 max-w-xl leading-relaxed text-slate-300">{body}</p>}
          </div>

          <div className="p-8 md:p-12">
            {status === 'success' ? (
              <SuccessCard />
            ) : (
              <form onSubmit={onSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="First name" name="first_name" required autoComplete="given-name" />
                  <Field label="Last name" name="last_name" required autoComplete="family-name" />
                  <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
                  <Field label="Email" name="email" type="email" autoComplete="email" />
                </div>
                <div className="mt-5">
                  <Field label="What do you need?" name="service" placeholder="e.g. the service you're interested in" />
                </div>
                <div className="mt-5">
                  <Textarea label="Project details" name="message" required rows={5} placeholder="A few sentences about the work." />
                </div>
                {status === 'error' && error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <SubmitButton status={status} />
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
