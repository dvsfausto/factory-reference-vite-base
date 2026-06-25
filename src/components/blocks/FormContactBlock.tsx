import { useState, type FormEvent } from 'react'
import { SITE } from '~/data/site'
import { submitLead, type LeadStatus } from './forms-submit'
import { Field, Textarea, SubmitButton, SuccessCard } from './form-ui'

// Forms LAYOUT: 'contact' — a clean, centered general contact form. Character-
// agnostic. Posts the confirmed handle-website-lead envelope via submitLead
// (source_page 'contact'). The conversion point — trustworthy, DNA-tokened.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light
// surface component-owned (#F8FAFC / white card / #E6E8EC). Never bg-brand-*.
export function FormContactBlock({
  label = 'Contact us',
  heading = 'Get in touch',
  body = 'Send us a note and a real person replies within one business day.',
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
    try {
      await submitLead(
        {
          first_name: String(fd.get('first_name') ?? ''),
          last_name: String(fd.get('last_name') ?? ''),
          phone: String(fd.get('phone') ?? ''),
          email: String(fd.get('email') ?? '') || undefined,
          message: String(fd.get('message') ?? ''),
        },
        'contact',
      )
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <span className="inline-flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
              {heading}
            </h2>
            {body && <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[#64748B]">{body}</p>}
          </div>

          <div className="mt-10">
            {status === 'success' ? (
              <SuccessCard />
            ) : (
              <form onSubmit={onSubmit} className="rounded-2xl border border-[#E6E8EC] bg-white p-8 md:p-10">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="First name" name="first_name" required autoComplete="given-name" />
                  <Field label="Last name" name="last_name" required autoComplete="family-name" />
                  <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
                  <Field label="Email" name="email" type="email" autoComplete="email" />
                </div>
                <div className="mt-5">
                  <Textarea label="How can we help?" name="message" required rows={5} placeholder="A few sentences about what you need." />
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
