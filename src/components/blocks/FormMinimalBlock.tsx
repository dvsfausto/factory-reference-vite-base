import { useState, type FormEvent } from 'react'
import { tr } from '~/lib/i18n'
import { SITE } from '~/data/site'
import { submitLead, type LeadStatus } from './forms-submit'
import { Field, Textarea, SubmitButton, SuccessCard } from './form-ui'

// Forms LAYOUT: 'minimal', a low-friction, few-field form (name, phone, a short
// note). Character-agnostic. The fastest path to a lead. Posts the confirmed
// handle-website-lead envelope (source_page 'contact'); last_name is sent empty
// (the contract allows it) to keep the form short.
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700. Radius -> rounded-* (DNA). Font -> font-display (DNA). Light
// surface component-owned (white / slate / #E6E8EC). Never bg-brand-* / .btn.
export function FormMinimalBlock({
  label = tr('form.getInTouch'),
  heading = tr('form.readyToStart'),
  body = tr('form.minimalBody'),
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
          last_name: '',
          phone: String(fd.get('phone') ?? ''),
          email: undefined,
          message: String(fd.get('message') ?? '') || tr('form.requestedCallback'),
        },
        'contact',
      )
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : tr('form.somethingWrong'))
    }
  }

  return (
    <section className="bg-[#F8FAFC]">
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#E6E8EC] bg-white p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-5">
            <div className="md:col-span-2">
              <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                <span className="h-px w-6 bg-emerald-600" />
                {label}
              </span>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-[#0F172A]">{heading}</h2>
              {body && <p className="mt-3 leading-relaxed text-[#64748B]">{body}</p>}
            </div>

            <div className="md:col-span-3">
              {status === 'success' ? (
                <SuccessCard />
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                  <Field label={tr('form.name')} name="first_name" required autoComplete="name" />
                  <Field label={tr('form.phone')} name="phone" type="tel" required autoComplete="tel" />
                  <Textarea label={tr('form.whatDoYouNeed')} name="message" rows={3} placeholder={tr('form.phMinimal')} />
                  {status === 'error' && error && <p className="text-sm text-red-600">{error}</p>}
                  <div className="mt-1 flex flex-wrap items-center gap-4">
                    <SubmitButton status={status} />
                    <a href={`tel:${SITE.phone}`} className="text-sm font-medium text-emerald-700 underline-offset-2 hover:underline">
                      Or call {SITE.phoneDisplay}
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
