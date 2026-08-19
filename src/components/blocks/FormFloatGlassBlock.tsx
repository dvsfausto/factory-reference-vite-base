import { useState, type FormEvent } from 'react'
import { tr } from '~/lib/i18n'
import { motion, useReducedMotion } from 'framer-motion'
import { SITE } from '~/data/site'
import { submitLead, type LeadStatus } from './forms-submit'
import { Field, Textarea, SubmitButton, SuccessCard } from './form-ui'

// Forms VARIANT: 'float-glass', a WOW re-skin of the default contact form. The
// SAME form (identical fields, names, and submitLead handler) now floats as a
// frosted glass card over a soft --wow-grad-surface, framed by a brand hairline
// and lifted by --wow-shadow-lift, rising in on scroll.
//
// WOW tokens consumed (all brand-derived via color-mix, see styles/app.css):
//   · --wow-grad-surface → the section background.
//   · --wow-grad-brand   → the kicker dot + the card's top accent hairline.
//   · --wow-shadow-lift  → the floating card shadow.
//   · --wow-hairline     → the card border.
//   · --wow-ease-out     → entrance easing.
// BRAND identity → the submit CTA (shared SubmitButton) uses bg-primary.
//
// FORM CONTRACT (unchanged): fields first_name/last_name/phone/email/message and
// the submitLead(..., 'contact') envelope are ported VERBATIM from FormContactBlock
// via the shared form-ui + forms-submit modules. ONLY the shell is restyled.
export function FormFloatGlassBlock({
  label = tr('form.contactUs'),
  heading = tr('form.getInTouch'),
  body = tr('form.contactBody'),
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

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundImage: 'var(--wow-grad-surface)' }}
    >
      <div className="container-x py-20 md:py-28">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <span className="inline-flex items-center justify-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundImage: 'var(--wow-grad-brand)' }}
              />
              {label}
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
              {heading}
            </h2>
            {body && <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-700">{body}</p>}
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            {status === 'success' ? (
              <SuccessCard />
            ) : (
              <form
                onSubmit={onSubmit}
                className="relative overflow-hidden rounded-[1.5rem] border bg-white/80 p-8 backdrop-blur-md md:p-10"
                style={{ borderColor: 'var(--wow-hairline)', boxShadow: 'var(--wow-shadow-lift)' }}
              >
                {/* Brand accent hairline across the top of the glass card. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-1"
                  style={{ backgroundImage: 'var(--wow-grad-brand)' }}
                />
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
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <SubmitButton status={status} />
                  <span className="text-sm text-ink-600">
                    Or call{' '}
                    <a href={`tel:${SITE.phone}`} className="font-medium text-brand-700 underline-offset-2 hover:underline">
                      {SITE.phoneDisplay}
                    </a>
                  </span>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
