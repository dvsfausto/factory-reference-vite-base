import { useState, useId } from 'react'
import { tr } from '~/lib/i18n'
import { BUSINESS_ID, SITE, SITE_LANGUAGE, SUPABASE_ENDPOINT } from '~/data/site'

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
  const idPrefix = useId()

  const update =
    <K extends keyof FormState>(key: K) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    setErrorMessage(null)

    const nameParts = form.name.trim().split(/\s+/)
    const firstName = nameParts[0] ?? ''
    const lastName = nameParts.slice(1).join(' ')

    const envelope: LeadEnvelope = {
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
        `We couldn't send your request. Please call us directly at ${SITE.phoneDisplay}.`,
      )
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900">Thanks — we got it.</h3>
        <p className="mt-3 text-base leading-relaxed text-slate-700">
          We&apos;ll be in touch within a business day. If it&apos;s urgent,
          call us at{' '}
          <a
            href={`tel:${SITE.phone}`}
            className="font-semibold text-emerald-700 hover:underline"
          >
            {SITE.phoneDisplay}
          </a>
          .
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
          autoComplete="name"
        />
        <Field
          id={`${idPrefix}-phone`}
          label={tr('form.phone')}
          type="tel"
          required
          value={form.phone}
          onChange={update('phone')}
          autoComplete="tel"
          inputMode="tel"
        />
        <Field
          id={`${idPrefix}-email`}
          label={tr('form.email')}
          type="email"
          value={form.email}
          onChange={update('email')}
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
}: {
  id: string
  label: string
  type: 'text' | 'tel' | 'email'
  required?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  autoComplete?: string
  inputMode?: 'tel' | 'numeric' | 'text'
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
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none transition-colors focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  )
}
