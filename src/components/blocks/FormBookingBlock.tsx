import { useState, type FormEvent } from 'react'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { submitLead, type LeadStatus } from './forms-submit'
import { Field, Textarea, SubmitButton, SuccessCard } from './form-ui'

// Forms LAYOUT: 'booking', an appointment-request form (preferred date + time).
// Character-agnostic. Posts the confirmed handle-website-lead envelope
// (source_page 'booking'); the date/time are FOLDED INTO message (no new payload
// keys, to keep the CRM contract exact).
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light
// surface component-owned (white / slate / #E6E8EC). Never bg-brand-* / .btn.
export function FormBookingBlock({
  site = SITE,
  label = tr('form.bookVisit'),
  heading = tr('form.requestAppointment'),
  headingLevel = 2,
  body = tr('form.bookingBody'),
}: {
  site?: typeof SITE
  label?: string
  heading?: string
  /** 1 when this block is the page title (a custom page whose layout has no `intro` block). */
  headingLevel?: 1 | 2
  body?: string
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  const [status, setStatus] = useState<LeadStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    setStatus('submitting')
    setError(null)
    const date = String(fd.get('preferred_date') ?? '').trim()
    const time = String(fd.get('preferred_time') ?? '').trim()
    const note = String(fd.get('message') ?? '').trim()
    const message = [date && `Preferred date: ${date}`, time && `Preferred time: ${time}`, note && `\n${note}`]
      .filter(Boolean)
      .join('\n')
    try {
      await submitLead(
        {
          first_name: String(fd.get('first_name') ?? ''),
          last_name: String(fd.get('last_name') ?? ''),
          phone: String(fd.get('phone') ?? ''),
          email: String(fd.get('email') ?? '') || undefined,
          message,
        },
        'booking',
      )
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
        <div className="mx-auto max-w-2xl">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            <Heading className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
              {heading}
            </Heading>
            {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
          </div>

          <div className="mt-10">
            {status === 'success' ? (
              <SuccessCard />
            ) : (
              <form onSubmit={onSubmit} className="rounded-2xl border border-[#E6E8EC] bg-white p-8 md:p-10">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label={tr('form.firstName')} name="first_name" required autoComplete="given-name" />
                  <Field label={tr('form.lastName')} name="last_name" required autoComplete="family-name" />
                  <Field label={tr('form.phone')} name="phone" type="tel" required autoComplete="tel" />
                  <Field label={tr('form.email')} name="email" type="email" autoComplete="email" />
                  <Field label={tr('form.preferredDate')} name="preferred_date" type="date" />
                  <Field label={tr('form.preferredTime')} name="preferred_time" placeholder={tr('form.phCallbackTime')} />
                </div>
                <div className="mt-5">
                  <Textarea label={tr('form.visitNotes')} name="message" rows={4} placeholder={tr('form.phVisitNotes')} />
                </div>
                {status === 'error' && error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <SubmitButton status={status} />
                  <span className="text-sm text-[#64748B]">
                    Or call{' '}
                    <a href={`tel:${site.phone}`} className="font-medium text-emerald-700 underline-offset-2 hover:underline">
                      {site.phoneDisplay}
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
