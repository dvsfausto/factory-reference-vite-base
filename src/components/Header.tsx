import { Link } from '@tanstack/react-router'
import { SITE } from '~/data/site'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          to="/"
          className="text-lg font-bold tracking-tight text-slate-900"
        >
          {SITE.name}
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
          <Link to="/services" className="hover:text-emerald-700">
            Services
          </Link>
          <Link to="/areas" className="hover:text-emerald-700">
            Areas
          </Link>
          <Link to="/reviews" className="hover:text-emerald-700">
            Reviews
          </Link>
          <Link to="/about" className="hover:text-emerald-700">
            About
          </Link>
          <Link to="/contact" className="hover:text-emerald-700">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE.phone}`}
            className="hidden text-sm font-semibold text-slate-900 hover:text-emerald-700 sm:inline"
          >
            {SITE.phoneDisplay}
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </header>
  )
}
