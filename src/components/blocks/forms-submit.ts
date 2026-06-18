import { BUSINESS_ID, SUPABASE_ENDPOINT } from '~/data/site'

// Shared lead submission — ported VERBATIM from the painter LeadForm's wired
// submit (the confirmed handle-website-lead contract). Every Forms variant posts
// this EXACT LeadEnvelope; the only thing that varies per variant is source_page
// (free-form intent) and how it composes `message`. No new top-level keys are
// invented (that could corrupt the CRM ingest), so richer variants fold extra
// fields into `message` rather than adding payload keys.
export type LeadStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface LeadInput {
  first_name: string
  last_name: string
  phone: string
  email?: string
  message: string
}

export async function submitLead(input: LeadInput, sourcePage: string): Promise<void> {
  const payload = {
    business_id: BUSINESS_ID,
    form_type: 'lead_form' as const,
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    message: input.message.trim(),
    source_url: typeof window !== 'undefined' ? window.location.href : '',
    source_page: sourcePage,
    language: 'en' as const,
    opt_in_sms: false,
  }
  const res = await fetch(SUPABASE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
}
