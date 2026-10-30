import { SITE } from '~/data/site'
import { tr } from '~/lib/i18n'
import { imageSrc } from '~/lib/asset-url'
import { comingSoonCopy } from '~/lib/coming-soon'
import { useCustomForm, type CustomForm } from '~/lib/useCustomForm'
import { CustomFormInline } from '~/components/blocks/FormCustomBlock'

/**
 * ★ THE COMING-SOON HOME (SITE.comingSoon). Exactly three things, top to bottom: the logo (big, centered), the hero
 * (the site's hero photo, a heading and an optional line; no buttons, no links), and the form, then one small link to
 * /privacy. The form is the owner's own custom form when they have one (a forms row: the baked form carries its id),
 * else a built-in one (first name, last name, phone, email, interest, message). Both post through the same
 * submit-customer-form path as every site form; the server reads the business's setting and records the source.
 */
function builtInForm(): CustomForm {
  return {
    name: tr('cs.title'),
    formType: 'coming_soon',
    fields: [
      { name: 'first_name', label: tr('form.firstName'), type: 'text', required: true },
      { name: 'last_name', label: tr('form.lastName'), type: 'text' },
      { name: 'phone', label: tr('form.phone'), type: 'tel' },
      { name: 'email', label: tr('form.email'), type: 'email', required: true },
      { name: 'interest', label: tr('cs.interest'), type: 'text' },
      { name: 'message', label: tr('cs.message'), type: 'textarea' },
    ],
  }
}

export function ComingSoonHome() {
  const own = useCustomForm()
  const form = own?.id ? own : builtInForm()
  const copy = comingSoonCopy()
  const hero = SITE.hero.image_url ? imageSrc(SITE.hero.image_url) : ''
  return (
    <div data-coming-soon="" className="bg-fam-card">
      <div className="container-x flex justify-center pt-10 pb-8 md:pt-14 md:pb-10">
        {SITE.logo_url ? (
          <img src={SITE.logo_url} alt={SITE.name} className="h-auto w-auto max-h-32 max-w-[80%] object-contain md:max-h-48" />
        ) : (
          <span className="font-display text-4xl font-semibold tracking-tight text-fam-ink md:text-6xl">{SITE.name}</span>
        )}
      </div>
      <section className="relative isolate overflow-hidden">
        {hero && <img src={hero} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />}
        <div className="absolute inset-0 -z-10 bg-fam-ink/45" aria-hidden="true" />
        <div className="container-x flex min-h-[46vh] flex-col items-center justify-center py-20 text-center md:min-h-[56vh]">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-fam-on-dark md:text-6xl">{copy.title ?? tr('cs.title')}</h1>
          {copy.text && <p className="mt-4 max-w-xl text-lg leading-relaxed text-fam-on-dark">{copy.text}</p>}
        </div>
      </section>
      <section className="container-x py-section">
        <div className="mx-auto max-w-3xl rounded-3xl border border-fam-hairline bg-fam-card p-8 elev-1 md:p-12">
          {(own?.id && own.name) && <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight text-fam-ink md:text-3xl">{own.name}</h2>}
          <CustomFormInline form={form} />
        </div>
        <p className="mt-6 text-center text-xs text-fam-ink-muted">
          <a href="/privacy" className="underline-offset-2 hover:underline">{tr('cs.privacy')}</a>
        </p>
      </section>
    </div>
  )
}
