import { Check } from 'lucide-react'
import { tr } from '~/lib/i18n'

// Shared, DNA-tokened form controls for the Forms variants (trustworthy, the
// conversion point). TOKEN DISCIPLINE: emerald-* (DNA) 50/100/600/700 focus +
// success accents, rounded-* (DNA), font-display (DNA), bg-primary submit.

export function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="font-display text-sm font-medium text-[#0F172A]">
        {label} {required && <span className="text-emerald-600">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-[#E6E8EC] bg-white px-4 py-3 text-base text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
      />
    </label>
  )
}

export function Textarea({
  label,
  name,
  required,
  rows = 4,
  placeholder,
}: {
  label: string
  name: string
  required?: boolean
  rows?: number
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="font-display text-sm font-medium text-[#0F172A]">
        {label} {required && <span className="text-emerald-600">*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-[#E6E8EC] bg-white px-4 py-3 text-base text-[#0F172A] outline-none transition-colors placeholder:text-[#94A3B8] focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
      />
    </label>
  )
}

export function SubmitButton({
  status,
  label = tr('form.sendRequest'),
}: {
  status: 'idle' | 'submitting' | 'success' | 'error'
  label?: string // editable per widget (e.g. the quote form's 'Request my quote')
}) {
  return (
    <button
      type="submit"
      disabled={status === 'submitting'}
      className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-7 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {status === 'submitting' ? tr('form.sending') : label}
    </button>
  )
}

export function SuccessCard({
  title = tr('form.successTitle'),
  body = tr('form.successBody'),
}: {
  // Affordance-specific success copy so a quote form doesn't confirm like a contact form.
  title?: string
  body?: string
} = {}) {
  return (
    <div className="rounded-2xl border border-emerald-600 bg-emerald-50 p-10 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-600 text-white">
        <Check className="h-6 w-6" />
      </span>
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-[#0F172A]">{title}</h3>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-[#475569]">{body}</p>
    </div>
  )
}
