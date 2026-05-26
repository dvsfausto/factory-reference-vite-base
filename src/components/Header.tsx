import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { SITE } from "~/data/site";
import { SERVICES } from "~/data/services";
import { AREAS } from "~/data/areas";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"services" | "areas" | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow ${
          scrolled ? "shadow-[0_2px_16px_rgba(11,42,91,0.08)]" : ""
        }`}
      >
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-brand-600 focus:text-white focus:px-3 focus:py-1.5 focus:rounded-md">
          Skip to content
        </a>
        <div className="container-x flex items-center justify-between h-20">
          <Link to="/" className="focus-ring rounded-md" aria-label={`${SITE.name} home`}>
            <Logo height={44} alt={SITE.name} />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu("services")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-[15px] font-medium text-ink-700 hover:text-brand-600 focus-ring rounded-md">
                Services <ChevronDown className="h-4 w-4" />
              </button>
              {openMenu === "services" && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="bg-white border border-ink-100 rounded-2xl shadow-xl p-2 w-72">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        className="block px-3 py-2 rounded-lg text-sm hover:bg-brand-50"
                      >
                        <div className="font-medium text-ink-900">{s.name}</div>
                        {s.tagline && <div className="text-xs text-ink-500">{s.tagline}</div>}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setOpenMenu("areas")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-[15px] font-medium text-ink-700 hover:text-brand-600 focus-ring rounded-md">
                Areas <ChevronDown className="h-4 w-4" />
              </button>
              {openMenu === "areas" && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="bg-white border border-ink-100 rounded-2xl shadow-xl p-2 w-64">
                    {AREAS.map((a) => (
                      <Link
                        key={a.slug}
                        to="/areas/$slug"
                        params={{ slug: a.slug }}
                        className="block px-3 py-2 rounded-lg text-sm font-medium text-ink-900 hover:bg-brand-50"
                      >
                        {a.name}
                      </Link>
                    ))}
                    <Link to="/areas" className="block px-3 py-2 rounded-lg text-sm font-medium text-brand-600 hover:bg-brand-50">
                      View all areas →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/pricing" className="px-3 py-2 text-[15px] font-medium text-ink-700 hover:text-brand-600 focus-ring rounded-md">Pricing</Link>
            <Link to="/reviews" className="px-3 py-2 text-[15px] font-medium text-ink-700 hover:text-brand-600 focus-ring rounded-md">Reviews</Link>
            <Link to="/about" className="px-3 py-2 text-[15px] font-medium text-ink-700 hover:text-brand-600 focus-ring rounded-md">About</Link>
            <Link to="/contact" className="px-3 py-2 text-[15px] font-medium text-ink-700 hover:text-brand-600 focus-ring rounded-md">Contact</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-brand-600 focus-ring rounded-md px-2 py-1">
              <Phone className="h-4 w-4" />
              {SITE.phoneDisplay}
            </a>
            <Link to="/contact" className="btn btn-md btn-primary">Free Quote</Link>
          </div>

          <button
            className="lg:hidden p-2 focus-ring rounded-md"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-ink-900" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] bg-white lg:hidden overflow-y-auto">
          <div className="container-x flex items-center justify-between h-20">
            <Logo height={40} alt={SITE.name} />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 focus-ring rounded-md">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="container-x pb-12 space-y-6">
            <div>
              <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Services</div>
              {SERVICES.map((s) => (
                <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} onClick={() => setOpen(false)} className="block py-2 text-base font-medium text-ink-900">
                  {s.name}
                </Link>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Areas</div>
              {AREAS.map((a) => (
                <Link key={a.slug} to="/areas/$slug" params={{ slug: a.slug }} onClick={() => setOpen(false)} className="block py-2 text-base font-medium text-ink-900">
                  {a.name}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <Link to="/pricing" onClick={() => setOpen(false)} className="block py-2 text-base font-medium text-ink-900">Pricing</Link>
              <Link to="/reviews" onClick={() => setOpen(false)} className="block py-2 text-base font-medium text-ink-900">Reviews</Link>
              <Link to="/about" onClick={() => setOpen(false)} className="block py-2 text-base font-medium text-ink-900">About</Link>
              <Link to="/contact" onClick={() => setOpen(false)} className="block py-2 text-base font-medium text-ink-900">Contact</Link>
            </div>
            <div className="pt-4 border-t border-ink-100 space-y-3">
              <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 text-base font-semibold text-brand-600">
                <Phone className="h-5 w-5" /> {SITE.phoneDisplay}
              </a>
              <Link to="/contact" onClick={() => setOpen(false)} className="btn btn-lg btn-primary w-full">
                Get Free Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
