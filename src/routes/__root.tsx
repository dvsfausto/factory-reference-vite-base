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
import { SITE } from '~/data/site'
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
      lang="en"
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
