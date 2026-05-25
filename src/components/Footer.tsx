import { Link } from '@tanstack/react-router'
import { SITE } from '~/data/site'
import { SERVICES } from '~/data/services'
import { AREAS } from '~/data/areas'
import { INFO_PAGES } from '~/data/info-pages'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="text-xl font-bold text-white">{SITE.name}</p>
          {SITE.tagline && (
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              {SITE.tagline}
            </p>
          )}
          <div className="mt-6 space-y-2 text-sm">
            <a
              href={`tel:${SITE.phone}`}
              className="block font-semibold text-white hover:text-emerald-400"
            >
              {SITE.phoneDisplay}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="block text-slate-400 hover:text-white"
            >
              {SITE.email}
            </a>
            {SITE.address.city && (
              <p className="text-slate-400">
                {[SITE.address.city, SITE.address.state, SITE.address.zip]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
            {SITE.hours && <p className="text-slate-400">{SITE.hours}</p>}
          </div>
        </div>

        <FooterCol title="Services">
          {SERVICES.map((s) => (
            <FooterLink key={s.slug} to={`/services/${s.slug}`} label={s.name} />
          ))}
        </FooterCol>

        <FooterCol title="Areas">
          {AREAS.map((a) => (
            <FooterLink key={a.slug} to={`/areas/${a.slug}`} label={a.name} />
          ))}
        </FooterCol>

        <FooterCol title="Company">
          <FooterLink to="/about" label="About" />
          <FooterLink to="/pricing" label="Pricing" />
          <FooterLink to="/reviews" label="Reviews" />
          <FooterLink to="/contact" label="Contact" />
          {INFO_PAGES.map((i) => (
            <FooterLink key={i.slug} to={`/info/${i.slug}`} label={i.name} />
          ))}
        </FooterCol>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {year} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>
      <ul className="space-y-2.5 text-sm">{children}</ul>
    </div>
  )
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <li>
      <Link to={to} className="text-slate-400 hover:text-white">
        {label}
      </Link>
    </li>
  )
}
