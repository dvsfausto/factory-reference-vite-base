import { useState, type FormEvent } from 'react'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { SITE } from '~/data/site'
import { submitLead, type LeadStatus } from './forms-submit'
import { Field, Textarea, SubmitButton, SuccessCard } from './form-ui'

// Forms LAYOUT: 'split-with-info' — the contact form beside a panel of real
// business contact details (phone, email, address, hours), which builds trust at
// the conversion point. Character-agnostic. Posts the confirmed handle-website-
// lead envelope (source_page 'contact').
//
// TOKEN DISCIPLINE: primary CTA -> bg-primary. Accent -> emerald-* (DNA)
// 50/100/600/700: emerald-50 icon chips. Radius -> rounded-* (DNA). Font ->
// font-display (DNA). Light surface component-owned. Never bg-brand-* / .btn.
export function FormSplitWithInfoBlock({
  label = 'Contact us',
  heading = "Let's talk",
  body = 'Reach out and a real person replies within one business day.',
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

  const addr = [SITE.address.street, SITE.address.city, SITE.address.state].filter(Boolean).join(', ')
  const rows = [
    { Icon: Phone, label: SITE.phoneDisplay, href: `tel:${SITE.phone}` },
    { Icon: Mail, label: SITE.email, href: `mailto:${SITE.email}` },
    addr ? { Icon: MapPin, label: addr } : null,
    SITE.hours ? { Icon: Clock, label: SITE.hours } : null,
  ].filter(Boolean) as { Icon: typeof Phone; label: string; href?: string }[]

  return (
    <section className="bg-white">
      <div className="container-x py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="h-px w-6 bg-emerald-600" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
              {heading}
            </h2>
            {body && <p className="mt-4 text-lg leading-relaxed text-[#64748B]">{body}</p>}
            <div className="mt-10 flex flex-col gap-5">
              {rows.map((r, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <r.Icon className="h-5 w-5" />
                  </span>
                  {r.href ? (
                    <a href={r.href} className="font-display font-medium text-[#0F172A] hover:text-emerald-700">{r.label}</a>
                  ) : (
                    <span className="font-display font-medium text-[#0F172A]">{r.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            {status === 'success' ? (
              <SuccessCard />
            ) : (
              <form onSubmit={onSubmit} className="rounded-2xl border border-[#E6E8EC] bg-[#F8FAFC] p-8 md:p-10">
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
                <div className="mt-8">
                  <SubmitButton status={status} />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
