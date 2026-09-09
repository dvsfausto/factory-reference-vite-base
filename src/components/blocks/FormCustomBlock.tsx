import { useState, type FormEvent } from 'react'
import { tr } from '~/lib/i18n'
import { BUSINESS_ID, SITE, SUPABASE_URL } from '~/data/site'
import { hasPhone } from '~/lib/phone'
import { useCustomForm, type FormField } from '~/lib/useCustomForm'
import { Field, Textarea, SubmitButton, SuccessCard } from './form-ui'
import { FormContactBlock } from './FormContactBlock'

// Forms LAYOUT: 'custom' (niche arc Stage 5) — the form rendered FROM ITS FIELD LIST: a plumber's asks
// whether the water is shut off, a dentist's asks the pain level. The list is data (useCustomForm: the
// owner's forms row, else the trade's default list baked at build), edited in the dashboard's Forms
// settings or through the assistant, re-read live when the owner has a row. One conditional: a field with
// showWhen renders only while the named field equals the value. No list → the fixed contact form,
// byte for byte (the same component, the same envelope): nothing here touches the existing lead path.
//
// SUBMISSION: submit-customer-form with every answer keyed by field name (form_data) — typed data, never
// folded into a message. That function creates or updates the contact from the standard keys (name,
// email, phone, message) and keeps the rest on the contact as metadata, and records the submission.
//
// TOKEN DISCIPLINE: the form-ui controls (fam-* tokens), bg-white card, rounded-* (DNA), font-display (DNA).
type Status = 'idle' | 'submitting' | 'success' | 'error'

function visible(f: FormField, values: Record<string, string>): boolean {
  if (!f.showWhen) return true
  return (values[f.showWhen.field] ?? '') === f.showWhen.equals
}

export function FormCustomBlock(props: {
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
  submitLabel?: string
  headingLevel?: 1 | 2
}) {
  const form = useCustomForm()
  if (!form) return <FormContactBlock {...props} />
  return <CustomForm form={form} {...props} />
}

/** The bare custom form (fields + submit), for surfaces that own their chrome — the contact page's section. */
export function CustomFormInline({ form, site = SITE }: { form: NonNullable<ReturnType<typeof useCustomForm>>; site?: typeof SITE }) {
  return <CustomForm form={form} site={site} inline />
}

function CustomForm({
  form,
  site = SITE,
  label,
  heading,
  body,
  submitLabel,
  headingLevel = 2,
  inline = false,
}: {
  form: NonNullable<ReturnType<typeof useCustomForm>>
  site?: typeof SITE
  label?: string
  heading?: string
  body?: string
  submitLabel?: string
  headingLevel?: 1 | 2
  /** Fields + submit only (the contact page owns the heading and the card). */
  inline?: boolean
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const set = (name: string, v: string) => setValues((p) => ({ ...p, [name]: v }))
  const shown = form.fields.filter((f) => visible(f, values))

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (String(fd.get('company_site') ?? '')) return // honeypot
    const form_data: Record<string, unknown> = {}
    for (const f of shown) {
      const raw = fd.get(f.name)
      if (f.type === 'checkbox') form_data[f.name] = raw === 'on'
      else if (f.type === 'number') { const n = Number(raw); if (raw !== null && raw !== '' && Number.isFinite(n)) form_data[f.name] = n }
      else if (raw !== null && String(raw).trim() !== '') form_data[f.name] = String(raw).trim()
    }
    setStatus('submitting'); setError(null)
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-customer-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: BUSINESS_ID, form_type: form.formType, form_data, source_page: typeof window !== 'undefined' ? window.location.pathname : '', source_url: typeof window !== 'undefined' ? window.location.href : '' }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setStatus('success')
    } catch (err) {
      setStatus('error'); setError(err instanceof Error ? err.message : tr('form.somethingWrong'))
    }
  }

  const control = (f: FormField) => {
    const id = `cf-${f.name}`
    switch (f.type) {
      case 'textarea':
        return <Textarea key={f.name} label={f.label} name={f.name} required={f.required} rows={4} placeholder={f.placeholder} />
      case 'select':
      case 'yesno': {
        const options = f.type === 'yesno' ? [tr('form.yes'), tr('form.no')] : (f.options ?? [])
        return (
          <label key={f.name} className="block">
            <span className="font-display text-sm font-medium text-fam-ink">{f.label} {f.required && <span className="text-fam-accent-text">*</span>}</span>
            <select id={id} name={f.name} required={f.required} value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)}
              className="mt-2 w-full rounded-xl border border-fam-hairline bg-white px-4 py-3 text-base text-fam-ink outline-none focus:border-fam-accent focus:ring-1 focus:ring-fam-accent">
              <option value="">{f.placeholder ?? tr('form.choose')}</option>
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
        )
      }
      case 'checkbox':
        return (
          <label key={f.name} className="flex items-center gap-3">
            <input id={id} type="checkbox" name={f.name} required={f.required} className="h-4 w-4 rounded border-fam-hairline accent-fam-accent" onChange={(e) => set(f.name, e.target.checked ? 'on' : '')} />
            <span className="text-sm text-fam-ink">{f.label}</span>
          </label>
        )
      case 'number':
        return (
          <label key={f.name} className="block">
            <span className="font-display text-sm font-medium text-fam-ink">{f.label} {f.required && <span className="text-fam-accent-text">*</span>}</span>
            <input id={id} type="number" name={f.name} required={f.required} min={f.min} max={f.max} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)}
              className="mt-2 w-full rounded-xl border border-fam-hairline bg-white px-4 py-3 text-base text-fam-ink outline-none placeholder:text-fam-ink-faint focus:border-fam-accent focus:ring-1 focus:ring-fam-accent" />
          </label>
        )
      default:
        return <Field key={f.name} label={f.label} name={f.name} type={f.type === 'date' ? 'date' : f.type} required={f.required} placeholder={f.placeholder} autoComplete={f.type === 'email' ? 'email' : f.type === 'tel' ? 'tel' : undefined} />
    }
  }

  const formMarkup = status === 'success' ? (
    <SuccessCard title={tr('form.customSuccessTitle')} body={form.successMessage ?? tr('form.customSuccessBody')} />
  ) : (
    <form onSubmit={onSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        {shown.map((f) => (
          <div key={f.name} className={f.type === 'textarea' || f.type === 'checkbox' ? 'md:col-span-2' : ''} onChangeCapture={(e) => { const t = e.target as HTMLInputElement; if (t?.name === f.name && f.type !== 'checkbox' && f.type !== 'select' && f.type !== 'yesno') set(f.name, t.value) }}>
            {control(f)}
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>{tr('form.companyWebsite')}<input type="text" name="company_site" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {status === 'error' && error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <SubmitButton status={status} label={submitLabel ?? tr('form.send')} />
        {!inline && hasPhone(site.phone) && (<span className="text-sm text-fam-ink-muted">
          Or call{' '}
          <a href={`tel:${site.phone}`} className="font-medium text-fam-accent-text-strong underline-offset-2 hover:underline">{site.phoneDisplay}</a>
        </span>)}
      </div>
    </form>
  )
  if (inline) return formMarkup
  return (
    <section className="bg-white">
      <div className="container-x py-section">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-fam-hairline bg-white shadow-sm">
          <div className="px-8 pt-10 md:px-12">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
              <span className="h-px w-6 bg-fam-accent" />
              {label ?? tr('form.getInTouch')}
            </span>
            <Heading className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-4xl">{heading ?? form.name}</Heading>
            {(body ?? form.description) && <p className="mt-3 max-w-xl leading-relaxed text-fam-ink-muted">{body ?? form.description}</p>}
          </div>
          <div className="p-8 md:p-12">
            {formMarkup}
          </div>
        </div>
      </div>
    </section>
  )
}
