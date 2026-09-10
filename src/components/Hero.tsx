import { Link } from '@tanstack/react-router'

interface CtaLink {
  label: string
  href: string
}

interface Props {
  headline: string
  subheadline?: string
  ctaPrimary: CtaLink
  ctaSecondary?: CtaLink
  badges?: string[]
  heroImage?: { src: string; alt: string }
}

export function Hero({
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  badges,
  heroImage,
}: Props) {
  return (
    <section className="bg-gradient-to-b from-fam-surface-slate to-fam-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            {headline}
          </h1>
          {subheadline && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-700">
              {subheadline}
            </p>
          )}
          {badges && badges.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              {badges.map((b) => (
                <li key={b} className="inline-flex items-center gap-1.5">
                  <span aria-hidden className="text-fam-accent-text">
                    ✓
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CtaButton link={ctaPrimary} variant="primary" />
            {ctaSecondary && <CtaButton link={ctaSecondary} variant="secondary" />}
          </div>
        </div>
        {heroImage && (
          <div className="order-first lg:order-last">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl elev-4">
              <img
                src={heroImage.src}
                alt={heroImage.alt}
                width={1200}
                height={900}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function CtaButton({
  link,
  variant,
}: {
  link: CtaLink
  variant: 'primary' | 'secondary'
}) {
  const className =
    variant === 'primary'
      ? 'inline-flex items-center justify-center rounded-md bg-fam-accent px-6 py-3 font-semibold text-fam-on-accent elev-1 hover:bg-fam-accent-deep transition-colors'
      : 'inline-flex items-center justify-center rounded-md border border-fam-line-slate-2 bg-fam-card px-6 py-3 font-semibold text-slate-900 hover:bg-fam-surface-slate transition-colors'
  if (link.href.startsWith('http') || link.href.startsWith('tel:') || link.href.startsWith('mailto:')) {
    return (
      <a href={link.href} className={className}>
        {link.label}
      </a>
    )
  }
  return (
    <Link to={link.href} className={className}>
      {link.label}
    </Link>
  )
}
