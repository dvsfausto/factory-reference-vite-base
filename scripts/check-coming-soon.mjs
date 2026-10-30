#!/usr/bin/env node
// check-coming-soon (2026-10-30): coming-soon mode (SITE.comingSoon) keeps its promises on the source. While on:
// every page but '/' and '/privacy' is a temporary redirect home; no header, footer or floating bars; the home page is
// the logo, the hero and the form with exactly one link (/privacy) and no tel:/mailto:; /privacy carries noindex.
// Off: every branch below is behind COMING_SOON, which reads SITE.comingSoon === true only.
import fs from 'node:fs'
const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')
const fails = []
const must = (ok, what) => { if (!ok) fails.push(what) }
const lib = read('src/lib/coming-soon.ts')
must(/\(SITE as \{ comingSoon\?: boolean \}\)\.comingSoon === true/.test(lib), 'COMING_SOON reads SITE.comingSoon === true only')
must(/return p === '\/' \|\| p === '\/privacy'/.test(lib), "only '/' and '/privacy' are allowed")
const root = read('src/routes/__root.tsx')
must(/beforeLoad: \(\{ location \}\) => \{\s*if \(COMING_SOON && !comingSoonAllows\(location\.pathname\)\) throw redirect\(\{ href: '\/', statusCode: 307 \}\)/.test(root), 'root beforeLoad redirects (307) every other page home while on')
const branch = (root.match(/if \(COMING_SOON\) \{\n\s*return \(([\s\S]*?)\n    \)\n  \}/) || [])[1] || ''
must(branch.includes('<Outlet />'), 'the coming-soon branch renders the page')
must(!/<Header|<Footer|TextUsPill|FloatingCTA|AnnouncementBar|CookieBanner/.test(branch), 'the coming-soon branch renders no header, footer or floating bar')
const home = read('src/components/ComingSoonHome.tsx')
const anchors = home.match(/<a\b[^>]*>/g) || []
must(anchors.length === 1 && /href="\/privacy"/.test(anchors[0]), 'the coming-soon home has exactly one link, to /privacy')
must(!/tel:|mailto:|<Link\b|PrimaryCta|<button\b/.test(home), 'no tel:, mailto:, router links, CTA or buttons outside the form')
must(/CustomFormInline form=\{form\}/.test(home), 'the form renders inline (no "or call" phone link)')
must(read('src/routes/index.tsx').includes('component: COMING_SOON ? ComingSoonHome : HomePage'), 'home switches to ComingSoonHome while on')
must(/COMING_SOON \? \{ \.\.\.m, meta: \[\.\.\.m\.meta, \{ name: 'robots', content: 'noindex' \}\] \} : m/.test(read('src/routes/privacy.tsx')), '/privacy carries noindex while on')
const inline = read('src/components/blocks/FormCustomBlock.tsx')
must(/\{!inline && hasPhone\(site\.phone\)/.test(inline), "the inline form keeps its phone link out")
if (fails.length) { console.error('✗ check-coming-soon:\n  - ' + fails.join('\n  - ')); process.exit(1) }
console.log('✓ check-coming-soon: redirect, noindex, no chrome, one link, all behind SITE.comingSoon')
