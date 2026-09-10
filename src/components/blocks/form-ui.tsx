import { Check } from 'lucide-react'
import { tr } from '~/lib/i18n'

// Shared, DNA-tokened form controls for the Forms variants (trustworthy, the
// conversion point). TOKEN DISCIPLINE: fam-accent-* (DNA) 50/100/600/700 focus +
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
      <span className="font-display text-sm font-medium text-fam-ink">
        {label} {required && <span className="text-fam-accent-text">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-fam-hairline bg-fam-card px-4 py-3 text-base text-fam-ink outline-none transition-colors placeholder:text-fam-ink-faint focus:border-fam-accent focus:ring-1 focus:ring-fam-accent"
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
      <span className="font-display text-sm font-medium text-fam-ink">
        {label} {required && <span className="text-fam-accent-text">*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-fam-hairline bg-fam-card px-4 py-3 text-base text-fam-ink outline-none transition-colors placeholder:text-fam-ink-faint focus:border-fam-accent focus:ring-1 focus:ring-fam-accent"
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
      className="inline-flex h-12 items-center justify-center rounded-xl bg-cta px-7 font-display text-sm font-semibold text-cta-foreground transition-[filter] hover:brightness-(--hov-shade) disabled:opacity-60"
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
    <div className="rounded-2xl border border-fam-accent bg-fam-accent-soft p-10 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-fam-accent text-fam-on-accent">
        <Check className="h-6 w-6" />
      </span>
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-fam-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-fam-ink-muted">{body}</p>
    </div>
  )
}
