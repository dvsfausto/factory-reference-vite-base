import { Link } from '@tanstack/react-router'

interface CtaLink {
  label: string
  href: string
}

interface Props {
  heading: string
  body?: string
  ctaPrimary: CtaLink
  ctaSecondary?: CtaLink
}

export function CTASection({ heading, body, ctaPrimary, ctaSecondary }: Props) {
  return (
    <section className="bg-emerald-700 text-white">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {heading}
        </h2>
        {body && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">{body}</p>
        )}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaButton link={ctaPrimary} variant="primary" />
          {ctaSecondary && <CtaButton link={ctaSecondary} variant="secondary" />}
        </div>
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
      ? 'inline-flex items-center justify-center rounded-md bg-white px-7 py-3 font-semibold text-emerald-700 shadow-sm hover:bg-slate-50 transition-colors'
      : 'inline-flex items-center justify-center rounded-md border border-white/40 bg-transparent px-7 py-3 font-semibold text-white hover:bg-white/10 transition-colors'
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
