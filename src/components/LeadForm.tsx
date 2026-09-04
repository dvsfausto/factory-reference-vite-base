import { useState, useId } from 'react'
import { tr } from '~/lib/i18n'
import { BUSINESS_ID, SITE, SITE_KEY, SITE_LANGUAGE, SUPABASE_ENDPOINT } from '~/data/site'

import { HAS_PHONE } from '~/lib/phone'
interface Props {
  heading?: string
  sublabel?: string
  submitLabel?: string
  formType?: string
}

interface FormState {
  name: string
  phone: string
  email: string
  message: string
}

const INITIAL: FormState = { name: '', phone: '', email: '', message: '' }

// CRITICAL — frozen Supabase envelope shape.
// Matches the same envelope cars-spanish + painting-english already POST.
// Edit at peril; the receiving Edge Function (handle-website-lead) expects
// these exact fields.
interface LeadEnvelope {
  /** Present only on builds made after site keys shipped; the server prefers it over business_id. */
  site_key?: string
  business_id: string
  form_type: string
  first_name: string
  last_name: string
  phone: string
  email?: string
  message: string
  source_url: string
  source_page: string
  language: 'en' | 'es'
  opt_in_sms: boolean
}

export function LeadForm({
  heading = (SITE as { ctaLabel?: string }).ctaLabel ?? tr('form.getFreeQuote'),
  sublabel = tr('form.leadReplyNote'),
  submitLabel = (SITE as { ctaLabel?: string }).ctaLabel ?? tr('form.requestQuote'),
  formType = 'lead_form',
}: Props) {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>(
    'idle',
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  /**
   * ═══════════════════════════════════════════════════════════════════════════════
   * ★★★ `required` MEANT NOTHING UNTIL THIS EXISTED.
   *
   * ⚠️ THE FORM CARRIES `noValidate`, which switches off the browser's own enforcement of the
   * `required` attributes below — and the submit handler never checked anything in its place. An
   * empty form therefore POSTed an empty lead and showed the visitor a thank-you. Reproduced 3 of 3
   * against the live site; `form.checkValidity()` returned false while the request went out anyway.
   *
   * ★ noValidate STAYS, deliberately. Native validation bubbles are written in the BROWSER's
   * locale, not the site's — a Spanish site would show English messages to a Spanish visitor, and
   * we cannot style or translate them. Owning the messages is the reason the attribute is there;
   * the only thing missing was the validation it implies. See i18n form.err*.
   * ═══════════════════════════════════════════════════════════════════════════════
   */
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const idPrefix = useId()

  const update =
    <K extends keyof FormState>(key: K) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
      /* ★ The error clears as they fix it — a message that stays put while the field is now correct
         reads as the form being broken. */
      setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
    }

  /**
   * ★ WHAT COUNTS AS FILLED IN. Deliberately forgiving: a phone is any 7+ digits (international
   * formats, spaces, dots and dashes all pass — the fleet's own records include "305.902.8345"),
   * and email is only checked when one was actually typed, because the field is optional.
   * ⚠️ It rejects EMPTY, not UNUSUAL. A real person with an odd number must never be turned away.
   */
  const validate = (v: FormState): Partial<Record<keyof FormState, string>> => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!v.name.trim()) next.name = tr('form.errName')
    const digits = v.phone.replace(/\D/g, '')
    if (!v.phone.trim()) next.phone = tr('form.errPhone')
    else if (digits.length < 7) next.phone = tr('form.errPhoneShort')
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
      next.email = tr('form.errEmail')
    return next
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return

    const found = validate(form)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      setErrorMessage(tr('form.errSummary'))
      /* ⚠️ MOVE THE CURSOR TO THE PROBLEM. On a phone the invalid field is often off-screen, and a
         summary line alone leaves the visitor tapping a button that appears to do nothing. */
      const first = (['name', 'phone', 'email', 'message'] as const).find((k) => found[k])
      if (first && typeof document !== 'undefined') {
        const el = document.getElementById(`${idPrefix}-${first}`)
        el?.focus()
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      }
      return
    }

    setErrors({})
    setStatus('submitting')
    setErrorMessage(null)

    const nameParts = form.name.trim().split(/\s+/)
    const firstName = nameParts[0] ?? ''
    const lastName = nameParts.slice(1).join(' ')

    const envelope: LeadEnvelope = {
      /* ★ The key decides the business server-side when present; business_id stays for builds made
         before keys existed, which is every already-published site. Sending both is harmless — the
         endpoint ignores business_id whenever a valid key is supplied. */
      ...(SITE_KEY ? { site_key: SITE_KEY } : {}),
      business_id: BUSINESS_ID,
      form_type: formType,
      first_name: firstName,
      last_name: lastName,
      phone: form.phone,
      email: form.email || undefined,
      message: form.message,
      source_url: typeof window !== 'undefined' ? window.location.href : '',
      source_page:
        typeof window !== 'undefined' ? window.location.pathname : '',
      language: SITE_LANGUAGE,
      opt_in_sms: false,
    }

    try {
      const response = await fetch(SUPABASE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(envelope),
      })
      if (!response.ok) throw new Error('submit_failed')
      setStatus('ok')
    } catch {
      setStatus('error')
      setErrorMessage(
        HAS_PHONE
          ? `We couldn't send your request. Please call us directly at ${SITE.phoneDisplay}.`
          : `We couldn't send your request. Please try again in a moment.`,
      )
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900">Thanks, we got it.</h3>
        <p className="mt-3 text-base leading-relaxed text-slate-700">
          We&apos;ll be in touch within a business day.
          {HAS_PHONE && (<>
            {' '}If it&apos;s urgent, call us at{' '}
            <a
              href={`tel:${SITE.phone}`}
              className="font-semibold text-emerald-700 hover:underline"
            >
              {SITE.phoneDisplay}
            </a>
            .
          </>)}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
    >
      <h3 className="text-2xl font-bold text-slate-900">{heading}</h3>
      <p className="mt-2 text-sm text-slate-600">{sublabel}</p>

      <div className="mt-6 grid gap-4">
        <Field
          id={`${idPrefix}-name`}
          label={tr('form.fullName')}
          type="text"
          required
          value={form.name}
          onChange={update('name')}
          error={errors.name}
          autoComplete="name"
        />
        <Field
          id={`${idPrefix}-phone`}
          label={tr('form.phone')}
          type="tel"
          required
          value={form.phone}
          onChange={update('phone')}
          error={errors.phone}
          autoComplete="tel"
          inputMode="tel"
        />
        <Field
          id={`${idPrefix}-email`}
          label={tr('form.email')}
          type="email"
          value={form.email}
          onChange={update('email')}
          error={errors.email}
          autoComplete="email"
        />
        <div>
          <Label htmlFor={`${idPrefix}-message`}>{tr('form.howCanWeHelp')}</Label>
          <textarea
            id={`${idPrefix}-message`}
            rows={4}
            value={form.message}
            onChange={update('message')}
            maxLength={1000}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none transition-colors focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        {status === 'submitting' ? tr('form.sending') : submitLabel}
      </button>

      {errorMessage && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </form>
  )
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-slate-700"
    >
      {children}
    </label>
  )
}

function Field({
  id,
  label,
  type,
  required,
  value,
  onChange,
  autoComplete,
  inputMode,
  error,
}: {
  id: string
  label: string
  type: 'text' | 'tel' | 'email'
  required?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  autoComplete?: string
  inputMode?: 'tel' | 'numeric' | 'text'
  /** The message for THIS field, or undefined. Drives the border, aria-invalid and the note. */
  error?: string
}) {
  return (
    <div>
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </Label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={255}
        /* ★ The error is ANNOUNCED, not just coloured — a red border alone says nothing to a
           screen reader, and colour alone fails anyone who cannot distinguish it. */
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-1 w-full rounded-md border bg-white px-3 py-2 text-base text-slate-900 outline-none transition-colors ${
          error
            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
            : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
