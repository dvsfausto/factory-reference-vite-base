import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary'
import { NotFound } from './components/NotFound'
import { SITE } from './data/site'

export function getRouter() {
  // DEV-ONLY showcase-harness hook. The /showcase preview drives the app-shell Header + Footer via
  // SITE.headerVariant / SITE.footerVariant — but those render as part of the ROOT shell, BEFORE any
  // /showcase route hook (component / beforeLoad / lazy module-eval) runs, so the variant must be set
  // here, before the router renders anything. This mirrors a REAL build, where the scaffolder emits
  // SITE.headerVariant as a static value in site.ts set at import (no render-order issue). Scoped to the
  // /showcase path so it can never touch a real page, and `import.meta.env.DEV` strips it from every
  // production bundle. A real site never carries ?family.
  if (import.meta.env.DEV && typeof window !== 'undefined' && window.location.pathname.startsWith('/showcase')) {
    const fam = new URLSearchParams(window.location.search).get('family') ?? undefined
    ;(SITE as { headerVariant?: string; footerVariant?: string }).headerVariant = fam
    ;(SITE as { headerVariant?: string; footerVariant?: string }).footerVariant = fam
  }
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: () => <NotFound />,
    scrollRestoration: true,
  })
  return router
}
