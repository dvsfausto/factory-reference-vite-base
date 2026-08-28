// DEV-ONLY variant showcase, renders EVERY variant of EVERY section with the local sample data, so the
// full vocabulary (not just the WOW set) can be eyeballed and judged. Not linked from any nav; not part of
// any build's layout. One section per screen-band, each variant labeled. A per-variant error boundary keeps
// one broken variant from crashing the page (a rendered error box is itself useful signal).
import { createFileRoute } from '@tanstack/react-router'
import { Component, useEffect, useState, type ReactNode } from 'react'
import { renderSection } from '~/components/render-section'
import { Footer } from '~/components/Footer'
import { SITE } from '~/data/site'
import { PROJECTS } from '~/data/projects'
import { SERVICES } from '~/data/services'
import { SERVICES as VIEW_SERVICES, PAGED_SERVICES } from '~/data/services-view'
import { reviews } from '~/data/reviews'
import { SERVICE_IMAGES } from '~/data/images'

// DEV-ONLY sample data so every variant renders POPULATED and with REAL PHOTOS (the curated per-industry
// Unsplash photos from industry_config.pane_photos, verified live). Without real images the photo-forward
// variants (spotlight/editorial/cinematic-masonry/featured-film/galleries) look broken rather than different.
// Cleaning + home-context imagery, so this reads as a cleaning showcase. Injected into the SITE/PROJECTS/
// SERVICES singletons at module load. Uncommitted / dev-only, nothing here ships. (Images only; VIDEO is a
// separate, unbuilt piece, videoUrl stays empty, only the poster image is set.)
const U = (id: string, w = 1200, h = 800) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`
const PH = {
  cleaning: '1527515637462-cff94eecc1ac', window: '1721620958961-cccc239cbb49', pressure: '1774031159721-aec9230f38db',
  floor: '1622936063167-e32e9f955438', paint: '1562259949-e8e7689d7828', pool: '1774109556498-652c0458d4af',
  junk: '1592850940640-9408f5a016cb', appliance: '1685186112493-564c68f75d57',
  p1: '1554080353-a576cf803bda', p2: '1700760934268-8aa0ef52ce0a', p3: '1635273051937-a0ddef9573b6', p4: '1599453052061-5c377643e4fa',
}
const img = (k: keyof typeof PH, w = 1000, h = 700) => U(PH[k], w, h)

// Real hero photo (imageSrc passes full URLs through unchanged).
SITE.hero.image_url = img('cleaning', 1600, 1000)

// Gallery / portfolio (the photo-forward gallery variants read PROJECTS). Replace the dead-id placeholders.
PROJECTS.length = 0
PROJECTS.push(
  { title: 'Move-out deep clean', caption: 'Illustrative, a typical project', image: img('cleaning'), alt: 'Deep clean', beforeImage: img('junk'), afterImage: img('cleaning') },
  { title: 'Streak-free windows', caption: 'Illustrative, a typical project', image: img('window'), alt: 'Windows' },
  { title: 'Pressure-washed exterior', caption: 'Illustrative, a typical project', image: img('pressure'), alt: 'Pressure washing' },
  { title: 'Spotless floors', caption: 'Illustrative, a typical project', image: img('floor'), alt: 'Floors' },
  { title: 'Fresh, tidy interior', caption: 'Illustrative, a typical project', image: img('paint'), alt: 'Interior' },
  { title: 'Poolside reset', caption: 'Illustrative, a typical project', image: img('pool'), alt: 'Pool area' },
)

// A real services set with per-service photos (the services variants read SERVICES + SERVICE_IMAGES).
SERVICES.length = 0
SERVICES.push(
  { slug: 'standard-clean', name: 'Standard Clean', short: 'Kitchens, baths, floors, and dusting on a regular rhythm.' } as (typeof SERVICES)[number],
  { slug: 'deep-clean', name: 'Deep Clean', short: 'Baseboards, blinds, inside cabinets, the deeper details.' } as (typeof SERVICES)[number],
  { slug: 'move-out', name: 'Move-Out Clean', short: 'Whole-home, top to bottom, ready for keys.' } as (typeof SERVICES)[number],
  { slug: 'window-cleaning', name: 'Window Cleaning', short: 'Streak-free interior and exterior glass.' } as (typeof SERVICES)[number],
  { slug: 'pressure-washing', name: 'Pressure Washing', short: 'Driveways, siding, and patios restored.' } as (typeof SERVICES)[number],
  { slug: 'post-construction', name: 'Post-Construction', short: 'Fine dust and debris after a remodel.' } as (typeof SERVICES)[number],
)
Object.assign(SERVICE_IMAGES, {
  'standard-clean': img('cleaning'), 'deep-clean': img('appliance'), 'move-out': img('junk'),
  'window-cleaning': img('window'), 'pressure-washing': img('pressure'), 'post-construction': img('floor'),
})
// services-view computes FILTERED SNAPSHOTS at its own module load, so mutating ./services above doesn't
// reach the blocks (which read services-view). Mirror the set into both view arrays.
for (const arr of [VIEW_SERVICES, PAGED_SERVICES]) { arr.length = 0; arr.push(...(SERVICES as typeof arr)) }
// reviews.ts ships empty, seed realistic cleaning reviews so the reviews variants (esp. elegant's editorial
// pull-quote) render.
reviews.length = 0
reviews.push(
  { id: '1', rating: 5, text: 'They turned our rental around in a single day, full deep clean, windows, the works. The new tenants walked into a spotless home.', author: 'Rachel M.', location: 'Hyde Park' } as (typeof reviews)[number],
  { id: '2', rating: 5, text: 'Same team every week for a year now. Our house has never been this consistently clean, and they just know our place.', author: 'The Okafor family', location: 'Montgomery' } as (typeof reviews)[number],
  { id: '3', rating: 5, text: 'Post-remodel dust was everywhere. Every surface, every vent, gone. Worth every penny.', author: 'Devin T.', location: 'Oakley' } as (typeof reviews)[number],
  { id: '4', rating: 5, text: 'Booking is easy, they show up on time, and the checklist is thorough. No surprises.', author: 'Carla S.', location: 'Norwood' } as (typeof reviews)[number],
  { id: '5', rating: 5, text: 'Careful with our two dogs and used products that did not bother anyone. Spotless and safe.', author: 'James R.', location: 'Clifton' } as (typeof reviews)[number],
)
Object.assign(SITE as Record<string, unknown>, {
  plans: [
    { name: 'Standard Clean', price: '$129', period: 'per visit', features: ['Kitchen & bathrooms deep-wiped', 'All floors vacuumed & mopped', 'Dusting, surfaces & mirrors', 'Beds made, trash taken out'] },
    { name: 'Deep Clean', price: '$219', period: 'per visit', features: ['Everything in Standard', 'Baseboards, blinds & vents', 'Inside cabinets & oven', 'Behind & under the furniture'] },
    { name: 'Move-Out', price: '$289', period: 'flat rate', features: ['Whole home, top to bottom', 'Inside every cabinet & closet', 'Appliance interiors', 'Walls spot-cleaned, ready for keys'] },
  ],
  packages: [
    { name: 'Weekly Care', price: '$109/visit', popular: true, includes: ['Same team every week', 'Priority scheduling', 'Checklist tuned to your home', '10% off deep cleans'] },
    { name: 'Bi-Weekly', price: '$129/visit', includes: ['Consistent rotation', 'Flexible reschedules', 'Kitchen & bath focus', 'Seasonal deep-clean add-on'] },
    { name: 'One-Time', price: 'from $149', includes: ['No commitment', 'Deep or standard', 'Perfect before an event', 'The same careful checklist'] },
  ],
  memberships: [
    { name: 'Home Essentials', price: '$99', period: '/mo', perks: ['One standard clean monthly', 'Member pricing on extras', 'Free reschedules', 'Text-a-cleaner support'] },
    { name: 'Home Plus', price: '$189', period: '/mo', highlighted: true, perks: ['Two cleans monthly', 'One deep clean per quarter', 'Priority booking', '20% off all add-ons'] },
    { name: 'Whole Home', price: '$349', period: '/mo', perks: ['Weekly cleaning', 'Quarterly deep clean', 'A dedicated team', 'First in line for holidays'] },
  ],
  team: [
    { name: 'Marisol Vega', role: 'Founder & Lead Cleaner', bio: 'Fifteen years making Cincinnati homes shine, and the author of our careful checklist.', photo: img('p1', 400, 500) },
    { name: 'Dominic Ford', role: 'Team Lead', bio: 'Detail-obsessed; owns our move-out and deep cleans. Never leaves a baseboard behind.', photo: img('p2', 400, 500) },
    { name: 'Priya Nair', role: 'Cleaning Specialist', bio: 'Eco-product expert who keeps homes with kids and pets both spotless and safe.', photo: img('p3', 400, 500) },
    { name: 'Tomas Reyes', role: 'Scheduling & Care', bio: 'The friendly voice on the phone who makes sure your team shows up on time, every time.', photo: img('p4', 400, 500) },
  ],
  promotions: [
    { title: 'First clean, 20% off', detail: 'New customers save on their first standard or deep clean this month.', code: 'FRESH20', expires: 'Aug 31' },
    { title: 'Refer a neighbor, get $40', detail: 'Give a friend $40 off; get $40 toward your next visit when they book.', code: 'NEIGHBOR40' },
  ],
  financing: { headline: 'Spread the cost of a full-home reset', partner: 'Sunbit', options: ['0% APR for 6 months on move-out packages', 'Pay-in-4 on any deep clean', 'Instant approval, no hard credit check', 'Pick your terms right at checkout'] },
  caseStudies: [
    { title: 'From chaos to move-in ready in a day', client: 'Hyde Park rental turnover', result: '8 hrs', summary: 'A same-day tenant turnover: full deep clean, appliance interiors, and windows so the new tenants walked into a spotless home.', image: img('cleaning') },
    { title: 'Weekly care for a busy family of five', client: 'Montgomery family home', result: '52 visits', summary: 'A full year of consistent weekly cleans with the same team, tuned to two kids and a golden retriever.', image: img('junk') },
    { title: 'Post-renovation dust, completely gone', client: 'Oakley kitchen remodel', result: '100% dust-free', summary: 'Fine construction dust cleared from every surface, vent, and corner after a full kitchen remodel.', image: img('appliance') },
  ],
  posts: [
    { title: 'How often should you deep clean? A room-by-room guide', href: '#', date: 'Aug 12, 2026', excerpt: 'Kitchens and baths need more love than guest rooms, here is a realistic cadence for a busy home.', image: img('floor') },
    { title: 'The 10-minute tidy that makes cleaning day easier', href: '#', date: 'Jul 28, 2026', excerpt: 'A few small habits between visits keep your home, and your cleaning cost, in great shape.', image: img('window') },
    { title: 'Pet-safe cleaning: what we use and why', href: '#', date: 'Jul 9, 2026', excerpt: 'The products that keep homes with dogs and cats both genuinely clean and safe.', image: img('pressure') },
  ],
  videoTestimonials: [
    { author: 'Rachel M., Hyde Park', quote: 'They turned our rental around in a single day. Absolutely spotless.', poster: img('cleaning'), videoUrl: '' },
    { author: 'The Okafor family', quote: 'Same team every week, our home has never been this consistently clean.', poster: img('window'), videoUrl: '' },
    { author: 'Devin T., Oakley', quote: 'Post-remodel dust was everywhere, then gone. Worth every penny.', poster: img('pool'), videoUrl: '' },
  ],
})

export const Route = createFileRoute('/showcase')({
  validateSearch: (s: Record<string, unknown>) => ({
    s: typeof s.s === 'string' ? s.s : undefined,
    family: typeof s.family === 'string' ? s.family : undefined,
  }),
  // NOTE: the app-shell Header/Footer variant is set in router.tsx (getRouter), the only hook that runs
  // BEFORE the root shell renders. A /showcase beforeLoad is too late — __root's <Header/> renders as part
  // of the root shell before this route's hooks run (confirmed: the header self-check measured
  // structure="standard" until the router.tsx hook was added).
  component: Showcase,
})

// A cohesive FAMILY mini-site (hero → trust → services → areas → reviews → cta → footer) so a family's
// rhythm can be judged as a whole, not one variant at a time. Character families use their own variant.
const FAMILY_FAQ: Record<string, string> = { creative: 'glass-accordion', 'wow-glass': 'glass-accordion' }

// The family's TOKENS the scaffolder emits (design_dna.typography/motion). The preview must apply them or it
// renders every family in the DEFAULT font, e.g. elegant WITHOUT its serif, which is exactly the harness-
// lies-about-the-product trap. Mirror of the orchestrator's DESIGN_DIRECTIONS fonts (representative pick;
// the seed varies within a family on a real build). Kept honest: a real build is the source of truth.
const FAMILY_TOKENS: Record<string, { display: string; googleFont: string; motion: 'full' | 'subtle' }> = {
  elegant: { display: '"Playfair Display", Georgia, serif', googleFont: 'Playfair+Display:ital,wght@0,500;0,600;1,500', motion: 'subtle' },
  bold: { display: '"Oswald", "Arial Narrow", sans-serif', googleFont: 'Oswald:wght@500;600;700', motion: 'full' },
  friendly: { display: '"Poppins", system-ui, sans-serif', googleFont: 'Poppins:wght@500;600;700', motion: 'full' },
  modern: { display: '"Sora", system-ui, sans-serif', googleFont: 'Sora:wght@500;600;700', motion: 'full' },
  corporate: { display: '"Libre Franklin", Arial, sans-serif', googleFont: 'Libre+Franklin:wght@600;700', motion: 'subtle' },
  creative: { display: '"Syne", system-ui, sans-serif', googleFont: 'Syne:wght@600;700;800', motion: 'full' },
  clean: { display: '"Manrope", system-ui, sans-serif', googleFont: 'Manrope:wght@500;600;700', motion: 'subtle' },
  'wow-glass': { display: '"Sora", system-ui, sans-serif', googleFont: 'Sora:wght@500;600;700', motion: 'full' },
}
function FamilyPreview({ family }: { family: string }) {
  // Drive the APP-SHELL footer (__root renders <Footer/>) via SITE.footerVariant, the SAME path a real
  // site uses, so the preview shows exactly ONE footer, the one this family would actually get. (Rendering
  // our own <Footer variant> here produced a second footer AND masked that the shell footer was still the
  // unwired default, the real gap.)
  ;(SITE as { footerVariant?: string }).footerVariant = family
  // Drive the APP-SHELL header the SAME way (__root renders <Header/>). Now the header is family-wired
  // (SITE.headerVariant), so the self-check below MEASURES the header the shell actually resolved.
  ;(SITE as { headerVariant?: string }).headerVariant = family
  const tok = FAMILY_TOKENS[family]
  // SELF-CHECK: a preview that cannot PROVE what it renders can't be judged. This applies the family font/
  // motion AND then MEASURES what actually computed (the rendered font, the resolved footer variant) and
  // shows it in the banner. If the intended font ≠ the computed font, the banner goes RED — no more judging a
  // harness that silently rendered the default (the @theme-inline literal bug that made elegant look right by luck).
  const [check, setCheck] = useState<null | { computedFont: string; fontOK: boolean; footerVar: string; motion: string; headerStructure: string; headerTheme: string; headerOK: boolean }>(null)
  useEffect(() => {
    if (!tok || typeof document === 'undefined') return
    const root = document.documentElement
    root.style.setProperty('--font-display', tok.display)
    root.classList.toggle('motion-subtle', tok.motion === 'subtle')
    // @theme inline compiles `.font-display` to a LITERAL in @layer utilities, beating a :root var override.
    // Inject an UNLAYERED rule (beats any @layer) to actually repoint it — the scaffolder's own technique.
    const style = document.createElement('style')
    style.textContent = `.font-display{font-family:${tok.display} !important}`
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = `https://fonts.googleapis.com/css2?family=${tok.googleFont}&display=swap`
    document.head.append(link, style)
    const raf = requestAnimationFrame(() => {
      const h = document.querySelector('[data-family] h1, [data-family] h2')
      const computedFont = h ? getComputedStyle(h).fontFamily : '(no heading found)'
      const want = (tok.display.split(',')[0] || '').replace(/["']/g, '').trim().toLowerCase()
      // MEASURE the shell header the SAME way we measure the font — read what Header.tsx actually resolved
      // (data-header-structure / -theme it stamps on <header>), not what we asked for. elegant → editorial
      // masthead, corporate → utility strip, everything else → standard bar.
      const hdr = document.querySelector('header[data-header-structure]') as HTMLElement | null
      const headerStructure = hdr?.dataset.headerStructure ?? '(no header)'
      const headerTheme = hdr?.dataset.headerTheme ?? '(none)'
      const wantStructure = family === 'elegant' ? 'editorial' : family === 'corporate' ? 'utility' : 'standard'
      setCheck({
        computedFont,
        fontOK: computedFont.toLowerCase().includes(want),
        footerVar: (SITE as { footerVariant?: string }).footerVariant ?? '(unset)',
        motion: root.classList.contains('motion-subtle') ? 'subtle' : 'full',
        headerStructure,
        headerTheme,
        headerOK: headerStructure === wantStructure,
      })
    })
    return () => { cancelAnimationFrame(raf); root.classList.remove('motion-subtle'); link.remove(); style.remove() }
  }, [family, tok])
  const core = ['hero', 'trustBar', 'servicesPreview', 'serviceAreas', 'reviews', 'faq', 'cta']
  const intendedFont = (tok?.display.split(',')[0] ?? '?').replace(/"/g, '')
  const bad = check ? (!check.fontOK || !check.headerOK || check.footerVar !== family) : false
  return (
    <div data-family={family}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: bad ? '#7f1d1d' : '#0f172a', color: '#e2e8f0', font: '600 12px ui-monospace, monospace', padding: '8px 14px' }}>
        <b>{family}</b> · font intended <b>{intendedFont}</b> → computed{' '}
        {check ? <b style={{ color: check.fontOK ? '#4ade80' : '#fca5a5' }}>{check.fontOK ? '✓ ' : '✗ NOT APPLIED: '}{check.computedFont.split(',')[0].replace(/"/g, '')}</b> : '…measuring'}
        {' '}· footer <b style={{ color: check?.footerVar === family ? '#4ade80' : '#fca5a5' }}>{check?.footerVar ?? '…'}</b>
        {' '}· motion <b>{check?.motion ?? '…'}</b>
        {' '}· header <b style={{ color: check ? (check.headerOK ? '#4ade80' : '#fca5a5') : undefined }}>{check ? `${check.headerOK ? '✓ ' : '✗ '}${check.headerStructure}/${check.headerTheme}` : '…'}</b>
        {bad && <span style={{ color: '#fca5a5' }}> — PREVIEW NOT FAITHFUL, do not judge</span>}
        {' '}· <span style={{ color: '#94a3b8' }}>a REAL BUILD is source of truth</span>
      </div>
      {core.map((type) => {
        const variant = type === 'faq' ? (FAMILY_FAQ[family] ?? 'accordion') : family
        return (
          <VariantBoundary key={type} id={`${family}:${type}`}>
            {renderSection({ type, variant } as never)}
          </VariantBoundary>
        )
      })}
    </div>
  )
}

// The full inventory (from the *_VARIANTS maps). type → every variant key it dispatches.
const INVENTORY: Array<{ type: string; variants: string[] }> = [
  { type: 'hero', variants: ['bold-fullbleed', 'elegant', 'friendly', 'modern', 'corporate', 'creative', 'centered', 'background', 'split-reversed', 'minimal', 'video', 'aurora', 'spotlight', 'editorial'] },
  { type: 'trustBar', variants: ['bold', 'elegant', 'friendly', 'modern', 'corporate', 'creative', 'icon-row', 'stat-numbers', 'logo-strip', 'credential-cells', 'glow-cards', 'hairline-rows'] },
  { type: 'servicesPreview', variants: ['bold', 'elegant', 'friendly', 'modern', 'corporate', 'creative', 'grid', 'alternating-rows', 'bento', 'list', 'icon-tiles', 'carousel', 'luxe', 'feature-rows', 'spotlight-tiles'] },
  { type: 'serviceAreas', variants: ['bold', 'elegant', 'friendly', 'modern', 'corporate', 'creative', 'chips', 'map-style', 'columned-list', 'cards', 'stacked', 'glow-pins', 'brand-panel'] },
  { type: 'reviews', variants: ['bold', 'elegant', 'friendly', 'modern', 'corporate', 'creative', 'grid', 'spotlight', 'carousel', 'masonry', 'stacked', 'luminous', 'pull-quote', 'glass-wall'] },
  { type: 'cta', variants: ['bold', 'elegant', 'friendly', 'modern', 'corporate', 'creative', 'band', 'color-block', 'split-with-image', 'boxed-card', 'stacked-centered', 'aurora-glow', 'glass-panel'] },
  { type: 'faq', variants: ['accordion', 'glass-accordion', 'split-panel'] },
  { type: 'story', variants: ['narrative', 'split-image', 'stat-band', 'milestone-timeline', 'editorial-frame', 'manifesto-glow'] },
  { type: 'gallery', variants: ['masonry', 'grid', 'before-after-slider', 'carousel', 'featured-thumbs', 'justified', 'cinematic-masonry', 'featured-film', 'edge-grid'] },
  { type: 'pricing', variants: ['tiers', 'comparison-table', 'toggle', 'cards', 'single-highlight', 'list', 'luxe-glass', 'spotlight-tier'] },
  { type: 'process', variants: ['numbered-steps', 'timeline', 'cards', 'alternating', 'vertical-rail', 'glow-nodes', 'bold-numerals'] },
  { type: 'forms', variants: ['contact', 'booking', 'quote', 'split-with-info', 'minimal', 'float-glass', 'brand-split'] },
  { type: 'faqSection', variants: ['accordion', 'two-column', 'list'] },
  { type: 'team', variants: ['grid', 'spotlight'] },
  { type: 'membership', variants: ['tier-cards', 'comparison', 'single-tier-highlight', 'perks-grid', 'table'] },
  { type: 'packages', variants: ['bundle-cards', 'tiered', 'feature-list', 'grid', 'comparison'] },
  { type: 'partners', variants: ['logo-wall', 'strip', 'grid', 'with-text'] },
  { type: 'promotions', variants: ['banner', 'cards', 'offer-grid', 'countdown-band'] },
  { type: 'financing', variants: ['highlight-band', 'cards', 'steps'] },
  { type: 'caseStudies', variants: ['featured', 'grid', 'alternating-rows', 'carousel', 'list'] },
  { type: 'blog', variants: ['card-grid', 'list'] },
  { type: 'map', variants: ['embed-style-panel', 'split-with-areas', 'full-width-band'] },
  { type: 'videoTestimonials', variants: ['grid', 'featured-thumbs', 'carousel', 'spotlight'] },
]

class VariantBoundary extends Component<{ id: string; children: ReactNode }, { err: string | null }> {
  state = { err: null as string | null }
  static getDerivedStateFromError(e: unknown) { return { err: e instanceof Error ? e.message : String(e) } }
  render() {
    if (this.state.err) {
      return <div style={{ padding: '2rem', background: '#7f1d1d', color: '#fff', fontFamily: 'monospace', fontSize: 13 }}>⚠ {this.props.id} failed: {this.state.err}</div>
    }
    return this.props.children
  }
}

function Label({ text }: { text: string }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#0f172a', color: '#e2e8f0', font: '600 13px ui-monospace, monospace', padding: '6px 14px', letterSpacing: '.04em', borderTop: '2px solid #334155' }}>
      {text}
    </div>
  )
}

// Footer VARIANTS per family (chrome, not a renderSection block, shown here so footers are judgeable).
const FOOTER_FAMILIES = ['clean', 'corporate', 'creative', 'wow-glass', 'bold', 'friendly', 'modern', 'elegant']

function Showcase() {
  const { s, family } = Route.useSearch()
  if (family) return <FamilyPreview family={family} />
  const list = s ? INVENTORY.filter((x) => x.type === s) : INVENTORY
  const showFooters = !s || s === 'footer'
  return (
    <div id="showcase">
      {list.map((sec) => (
        <section key={sec.type} data-section={sec.type}>
          <h2 style={{ background: '#1e293b', color: '#fff', font: '700 20px system-ui', padding: '14px 18px', margin: 0 }}>
            {sec.type}, {sec.variants.length} variants
          </h2>
          {sec.variants.map((v) => {
            const id = `${sec.type}:${v}`
            return (
              <div key={id} data-variant={id}>
                <Label text={id} />
                <VariantBoundary id={id}>
                  {renderSection({ type: sec.type, variant: v } as never)}
                </VariantBoundary>
              </div>
            )
          })}
        </section>
      ))}
      {showFooters && (
        <section data-section="footer">
          <h2 style={{ background: '#1e293b', color: '#fff', font: '700 20px system-ui', padding: '14px 18px', margin: 0 }}>
            footer, {FOOTER_FAMILIES.length} family variants
          </h2>
          {FOOTER_FAMILIES.map((fam) => (
            <div key={fam} data-variant={`footer:${fam}`}>
              <Label text={`footer:${fam}`} />
              <VariantBoundary id={`footer:${fam}`}>
                <Footer variant={fam} />
              </VariantBoundary>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
