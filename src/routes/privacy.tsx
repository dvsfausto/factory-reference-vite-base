import { createFileRoute } from '@tanstack/react-router'
import { tr } from '~/lib/i18n'
import { buildMeta } from '~/lib/seo'
import { SITE } from '~/data/site'

// ★ /privacy (2026-09-16): the one statement every generated site can honestly make. Added the day the
// beacon started recording engagement and a daily visitor code, so the sites say what they collect.
// Short on purpose: what is collected, what is not, and who to ask. It is NOT a legal document — an
// owner-made privacy page (a custom page whose slug says privacy) takes the footer link instead.
export const Route = createFileRoute('/privacy')({
  head: () => buildMeta({ title: `${tr('privacy.title')} | ${SITE.name}`, description: tr('privacy.intro'), path: '/privacy' }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <main className="container-x py-16 max-w-2xl">
      <h1 className="text-3xl font-semibold font-display">{tr('privacy.title')}</h1>
      <p className="mt-4 text-base leading-relaxed">{tr('privacy.intro')}</p>
      <ul className="mt-6 list-disc pl-5 space-y-2 text-base leading-relaxed">
        <li>{tr('privacy.collect')}</li>
        <li>{tr('privacy.noCookies')}</li>
        <li>{tr('privacy.visitorCode')}</li>
        <li>{tr('privacy.forms')}</li>
      </ul>
      <p className="mt-6 text-base leading-relaxed">{tr('privacy.contact')}{SITE.email ? ` ${SITE.email}` : ''}.</p>
    </main>
  )
}
