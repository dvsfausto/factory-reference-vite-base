import { useEffect, useState } from 'react'
import { BUSINESS_ID, SITE, SUPABASE_ANON_KEY, SUPABASE_URL } from '~/data/site'

// THE CUSTOM FORM READ (niche arc Stage 5) — the booking-widget model over the owner's forms row. The
// field list is DATA: baked by the scaffolder into SITE.customForm (the owner's active custom form, else the
// template's default field list for the trade), then re-read LIVE from the forms table when the build named
// a row id, so a field the owner adds, renames or reorders in the dashboard shows with no rebuild. A failed
// or empty read keeps the baked list. The fixed contact form is untouched: a site with no field list
// renders it exactly as before.
export type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number' | 'date' | 'checkbox' | 'yesno'
export interface FormField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: string[]
  /** Show this field only when another field equals a value (the one conditional the stage carries). */
  showWhen?: { field: string; equals: string }
  min?: number
  max?: number
}
export interface CustomForm {
  /** The forms row id when the owner has one (the live read); absent → the template's default list. */
  id?: string
  name: string
  description?: string
  successMessage?: string
  fields: FormField[]
  formType: string
}

export function readBakedForm(site: typeof SITE = SITE): CustomForm | null {
  const f = (site as { customForm?: CustomForm }).customForm
  return f && Array.isArray(f.fields) && f.fields.length ? f : null
}

const TYPES: readonly FieldType[] = ['text', 'email', 'tel', 'textarea', 'select', 'number', 'date', 'checkbox', 'yesno']
/** Mirrors the scaffolder's normaliser (factory-build scaffolder src/lib/custom-forms.ts): the same rules for a live row. */
export function normaliseFields(raw: unknown): FormField[] {
  if (!Array.isArray(raw)) return []
  const out: FormField[] = []
  for (const r of raw as Array<Record<string, unknown>>) {
    if (!r || typeof r !== 'object') continue
    const name = typeof r.name === 'string' ? r.name.trim() : ''
    const label = typeof r.label === 'string' ? r.label.trim() : ''
    if (!name || !label) continue
    const type = (TYPES as readonly string[]).includes(String(r.type)) ? (r.type as FieldType) : 'text'
    const f: FormField = { name, label, type }
    if (r.required === true) f.required = true
    if (typeof r.placeholder === 'string' && r.placeholder.trim()) f.placeholder = r.placeholder.trim()
    if (Array.isArray(r.options)) { const o = r.options.filter((x): x is string => typeof x === 'string' && !!x.trim()).map((x) => x.trim()); if (o.length) f.options = o }
    const sw = r.showWhen as { field?: unknown; equals?: unknown } | undefined
    if (sw && typeof sw.field === 'string' && sw.field.trim() && typeof sw.equals === 'string') f.showWhen = { field: sw.field.trim(), equals: sw.equals }
    if (typeof r.min === 'number') f.min = r.min
    if (typeof r.max === 'number') f.max = r.max
    out.push(f)
  }
  return out
}

export function useCustomForm(): CustomForm | null {
  const [form, setForm] = useState<CustomForm | null>(readBakedForm)
  useEffect(() => {
    const baked = readBakedForm()
    if (!baked?.id) return
    let cancelled = false
    const url = `${SUPABASE_URL}/rest/v1/forms?id=eq.${baked.id}&is_active=eq.true&select=id,name,description,success_message,form_type,fields`
    fetch(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rows: Array<Record<string, unknown>>) => {
        if (cancelled || !Array.isArray(rows) || !rows[0]) return
        const row = rows[0]
        const fields = normaliseFields(row.fields)
        if (!fields.length) return
        setForm({
          id: String(row.id),
          name: typeof row.name === 'string' && row.name.trim() ? row.name.trim() : baked.name,
          ...(typeof row.description === 'string' && row.description.trim() ? { description: row.description.trim() } : {}),
          ...(typeof row.success_message === 'string' && row.success_message.trim() ? { successMessage: row.success_message.trim() } : {}),
          formType: typeof row.form_type === 'string' ? row.form_type : baked.formType,
          fields,
        })
      })
      .catch(() => {
        /* keep baked — degrade-safe */
      })
    return () => {
      cancelled = true
    }
  }, [])
  return form
}
