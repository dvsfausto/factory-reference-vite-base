/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { Header } from '~/components/Header'
import { Footer } from '~/components/Footer'
import { JsonLd } from '~/components/JsonLd'
import { localBusinessLd } from '~/lib/seo'
import { SITE, SITE_LANGUAGE, BUSINESS_ID, SITE_KEY, SUPABASE_URL } from '~/data/site'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE.name },
      { name: 'description', content: SITE.description || SITE.name },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:title', content: SITE.name },
      { property: 'og:description', content: SITE.description || SITE.name },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: SITE.name },
      { name: 'twitter:description', content: SITE.description || SITE.name },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // Google Fonts: Inter (body), Cormorant Garamond (display), Great Vibes (script).
      // Matches the Lovable design tokens lifted into styles/app.css @theme.
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Great+Vibes&display=swap',
      },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html
      /**
       * ★★ THE DOCUMENT'S OWN LANGUAGE, not a constant. This was hardcoded `lang="en"` and nothing
       * downstream patched it, so EVERY generated site declared English — including a fully Spanish
       * one, verified on a real build whose nav, CTAs and copy were all Spanish under `lang="en"`.
       * ⚠️ It is not cosmetic: screen readers pick a voice from it, browsers offer the wrong
       * translation, and search engines index the page as the wrong language.
       * `SITE_LANGUAGE` is emitted by the scaffolder and already drives tr(); this makes the tag
       * agree with the words on the page.
       */
      lang={SITE_LANGUAGE}
      // SITE.motionLevel='subtle' (restrained business types) → gentler scroll-reveal
      // (see .motion-subtle in app.css). Absent → full motion (byte-identical default).
      className={(SITE as { motionLevel?: string }).motionLevel === 'subtle' ? 'motion-subtle' : undefined}
    >
      <head>
        <HeadContent />
        {/* WOW motion layer: mark JS-capable BEFORE first paint so scroll-reveal hides its start-state
            without a flash. No-JS never sets this → content stays visible (SSR/SEO safe). */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{document.documentElement.classList.add('js-reveal')}catch(e){}",
          }}
        />
        {/* Own-beacon site analytics: dependency-free, fire-and-forget. Fires ONE sendBeacon on first
            load + every SPA route change (patches history.pushState/replaceState + popstate — TanStack
            Router navigates through the History API, so this catches all client navigations). business_id
            is baked in at generation (BUSINESS_ID from ~/data/site); the all-zeros placeholder is skipped
            so un-generated/preview builds never emit. Never blocks paint. Server enriches country/device. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              `(function(){var b=${JSON.stringify(BUSINESS_ID)},k=${JSON.stringify(SITE_KEY)},` +
              `e=${JSON.stringify(SUPABASE_URL + '/functions/v1/collect-pageview')};` +
              `if(!b||b==='00000000-0000-0000-0000-000000000000')return;var last='';` +
              /* ★★ THE KEY WHEN THERE IS ONE, THE BUSINESS ID WHEN THERE IS NOT.
                 ⚠️ THE FALLBACK IS NOT A LEFTOVER — IT IS WHAT KEEPS THE ROLLOUT SAFE. A build that
                 runs before the trigger supplies a key emits SITE_KEY as '' and posts exactly what
                 it posts today, so the two sides can ship in either order and nothing depends on a
                 key existing. The server records an unkeyed view with source NULL rather than
                 guessing it is ours. */
              `function ping(){try{var p=location.pathname+location.search;if(p===last)return;last=p;` +
              `var body=JSON.stringify(k?{site_key:k,path:p,referrer:document.referrer||''}:{business_id:b,path:p,referrer:document.referrer||''});` +
              `if(navigator.sendBeacon){navigator.sendBeacon(e,body)}` +
              `else{fetch(e,{method:'POST',body:body,keepalive:true,headers:{'Content-Type':'application/json'}})}` +
              `}catch(_){}}` +
              `ping();var w=function(t){var o=history[t];if(!o)return;` +
              `history[t]=function(){var r=o.apply(this,arguments);ping();return r}};` +
              `w('pushState');w('replaceState');addEventListener('popstate',ping)})();`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  return (
    <>
      <JsonLd data={localBusinessLd()} />
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
