import { useState, type FormEvent } from 'react'
import { tr } from '~/lib/i18n'
import { motion, useReducedMotion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { SITE } from '~/data/site'
import { submitLead, type LeadStatus } from './forms-submit'
import { Field, Textarea, SubmitButton, SuccessCard } from './form-ui'

// Forms VARIANT: 'brand-split', a WOW split at the conversion point: a full
// brand-gradient side panel (heading + the REAL business contact details) beside
// the form, which floats as a glass card. Same form, richer frame than the plain
// 'split-with-info' default, the panel is a brand-gradient wash lit by a glow.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-brand   → the side panel fill.
//   · --wow-grad-surface → the section background.
//   · --wow-shadow-lift  → the whole split card's lift shadow.
//   · --wow-hairline     → the form-side hairline (on the shared split card).
//   · --wow-ease-out     → entrance easing.
// BRAND identity → the submit CTA (shared SubmitButton) uses bg-primary.
//
// FORM CONTRACT (unchanged): fields first_name/last_name/phone/email/message and
// submitLead(..., 'contact') are VERBATIM from the default via shared form-ui +
// forms-submit. ONLY the shell is restyled. HONESTY: the info rows are the REAL
// SITE fields (phone/email/address/hours), each row omits when its field is empty.
export function FormBrandSplitBlock({
  label = tr('form.contactUs'),
  heading = tr('form.letsTalk'),
  body = tr('form.replyBusinessDay'),
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const reduce = useReducedMotion()
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
      setError(err instanceof Error ? err.message : tr('form.somethingWrong'))
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
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-20 md:py-28">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 overflow-hidden rounded-[1.75rem] border bg-white lg:grid-cols-2"
          style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-lift)' }}
        >
          {/* Brand-gradient info panel, real contact details only. */}
          <div
            className="relative flex flex-col p-9 text-white md:p-12"
            style={{ backgroundImage: 'var(--wow-grad-brand)' }}
          >
            <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              {heading}
            </h2>
            {body && <p className="mt-4 max-w-md leading-relaxed text-white/85">{body}</p>}

            <div className="mt-10 flex flex-col gap-5">
              {rows.map((r, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                    <r.Icon className="h-5 w-5" />
                  </span>
                  {r.href ? (
                    <a href={r.href} className="font-display font-medium text-white hover:text-white/80">{r.label}</a>
                  ) : (
                    <span className="font-display font-medium text-white">{r.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form side. */}
          <div className="p-9 md:p-12">
            {status === 'success' ? (
              <SuccessCard />
            ) : (
              <form onSubmit={onSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label={tr('form.firstName')} name="first_name" required autoComplete="given-name" />
                  <Field label={tr('form.lastName')} name="last_name" required autoComplete="family-name" />
                  <Field label={tr('form.phone')} name="phone" type="tel" required autoComplete="tel" />
                  <Field label={tr('form.email')} name="email" type="email" autoComplete="email" />
                </div>
                <div className="mt-5">
                  <Textarea label={tr('form.howCanWeHelp')} name="message" required rows={5} placeholder={tr('form.phHelp')} />
                </div>
                {status === 'error' && error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                <div className="mt-8">
                  <SubmitButton status={status} />
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
