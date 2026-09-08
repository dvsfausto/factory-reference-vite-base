import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { tr } from '~/lib/i18n'
import { imageSrc } from '~/lib/asset-url'
import { useProducts } from '~/lib/useProducts'

// Product grid LAYOUT: 'cards' (niche arc Stage 4) — a read-only catalogue: photo, name, price (with the
// compare-at struck through when the owner set one), a stock note, and ONE action: the owner's payment link
// when enabled ("Buy"), else "Ask about this" to the contact form. No cart, no checkout — that is the
// ecommerce arc; a grid that leads to "Order" on the contact form is honest today.
//
// LIVE-READ on the booking-widget model (useProducts): SSR from SITE.products (baked from the products table
// at build), the client reconciles live. Returns null with no products. Text = block params
// (label/heading/body). Nothing here is invented: no price → "Ask", no photo → a plain tile.
//
// TOKEN DISCIPLINE: fam-* surfaces/ink/hairline, bg-cta for the buy action, rounded-* (DNA), font-display.
export function ProductGridBlock({
  label,
  heading,
  body,
}: {
  label?: string
  heading?: string
  body?: string
}) {
  const products = useProducts()
  if (products.length === 0) return null
  return (
    <section className="bg-white">
      <div className="container-x py-section">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-fam-accent-text">
            <span className="h-px w-6 bg-fam-accent" />
            {label ?? tr('products.eyebrow')}
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-fam-ink sm:text-5xl">
            {heading ?? tr('products.heading')}
          </h2>
          {body && <p className="mt-4 text-lg leading-relaxed text-fam-ink-muted">{body}</p>}
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <li key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-fam-hairline bg-white transition-shadow hover:shadow-md">
              <div className="relative aspect-square bg-fam-surface-2">
                {p.image ? (
                  <img src={imageSrc(p.image)} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div aria-hidden="true" className="flex h-full w-full items-center justify-center font-display text-5xl font-semibold text-fam-ink-faint">
                    {p.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
                {p.stock === 'out' && (
                  <span className="absolute left-3 top-3 rounded-full bg-fam-ink px-3 py-1 text-xs font-semibold text-white">{tr('products.soldOut')}</span>
                )}
                {p.stock === 'low' && (
                  <span className="absolute left-3 top-3 rounded-full bg-fam-accent-soft px-3 py-1 text-xs font-semibold text-fam-accent-text-strong">{tr('products.lowStock')}</span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-semibold leading-snug text-fam-ink">{p.name}</h3>
                {p.description && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-fam-ink-muted">{p.description}</p>}
                <div className="mt-4 flex items-baseline gap-2">
                  {p.price ? (
                    <span className="font-display text-xl font-semibold tabular-nums text-fam-ink">{p.price}</span>
                  ) : (
                    <span className="text-sm text-fam-ink-muted">{tr('products.askPrice')}</span>
                  )}
                  {p.price && p.compareAtPrice && <span className="text-sm tabular-nums text-fam-ink-faint line-through">{p.compareAtPrice}</span>}
                </div>
                <div className="mt-auto pt-5">
                  {p.buyUrl && p.stock !== 'out' ? (
                    <a
                      href={p.buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-cta px-4 text-sm font-semibold text-cta-foreground transition-opacity hover:opacity-90"
                    >
                      {tr('products.buy')} <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <Link
                      to="/contact"
                      className="inline-flex h-10 items-center rounded-xl border border-fam-hairline px-4 text-sm font-semibold text-fam-ink transition-colors hover:border-fam-accent hover:text-fam-accent-text-strong"
                    >
                      {tr('products.ask')}
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
