import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { SITE } from "~/data/site";
import { SERVICES } from "~/data/services";
import { AREAS } from "~/data/areas";

// Character-aware root header. The shell sees SITE (not the homepage layout), so
// it picks its treatment from SITE.character (emitted by the scaffolder only for
// bold/elegant verticals). Absent → the 'default' theme below, whose class
// strings are today's verbatim markup, so verticals that do not set a character
// render byte-identically.
//
// TOKEN DISCIPLINE: CTA → bg-primary / text-primary-foreground (brand-owned).
// Accent → emerald-* (DNA). Warm-dark neutral for elegant is hardcoded here
// (espresso #1A1410 / leather #241C16 / hairline #3A2E24 / cream #F2E8DC / taupe
// #B8A893), contained to the character themes. Bold uses the cool ink-* dark.
interface HeaderTheme {
  shell: string;
  scrolledShadow: string;
  skip: string;
  navLink: string;
  cta: string;
  ctaLabel: string;
  dropdownSurface: string;
  dropdownItem: string;
  dropdownTitle: string;
  dropdownSub: string;
  areaAllLink: string;
  phoneLink: string;
  menuIcon: string;
  logoLight: boolean;
  mobilePanel: string;
  mobileText: string;
  mobileLabel: string;
  mobileBorder: string;
  mobilePhone: string;
  mobileCta: string;
}

const HEADER_THEMES: Record<string, HeaderTheme> = {
  default: {
    shell: "bg-white/95",
    scrolledShadow: "shadow-[0_2px_16px_rgba(11,42,91,0.08)]",
    skip: "focus:bg-brand-600 focus:text-white",
    navLink: "text-[15px] font-medium text-ink-700 hover:text-brand-600",
    cta: "btn btn-md btn-primary",
    ctaLabel: "Free Quote",
    dropdownSurface: "bg-white border border-ink-100 rounded-2xl shadow-xl",
    dropdownItem: "hover:bg-brand-50",
    dropdownTitle: "text-ink-900",
    dropdownSub: "text-ink-500",
    areaAllLink: "text-brand-600 hover:bg-brand-50",
    phoneLink: "text-ink-700 hover:text-brand-600",
    menuIcon: "text-ink-900",
    logoLight: false,
    mobilePanel: "bg-white",
    mobileText: "text-ink-900",
    mobileLabel: "text-ink-500",
    mobileBorder: "border-ink-100",
    mobilePhone: "text-brand-600",
    mobileCta: "btn btn-lg btn-primary w-full",
  },
  bold: {
    shell: "bg-ink-900",
    scrolledShadow: "shadow-[0_2px_16px_rgba(0,0,0,0.45)]",
    skip: "focus:bg-emerald-600 focus:text-white",
    navLink: "font-display text-sm font-semibold uppercase tracking-wide text-ink-100 hover:text-white",
    cta: "inline-flex h-[42px] items-center rounded-md bg-primary px-5 font-display text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90",
    ctaLabel: "Free estimate",
    dropdownSurface: "bg-ink-900 border border-white/10 rounded-md shadow-xl",
    dropdownItem: "hover:bg-white/5",
    dropdownTitle: "text-ink-100",
    dropdownSub: "text-ink-100/60",
    areaAllLink: "text-emerald-600 hover:bg-white/5",
    phoneLink: "text-ink-100 hover:text-white",
    menuIcon: "text-white",
    logoLight: true,
    mobilePanel: "bg-ink-900",
    mobileText: "text-ink-100",
    mobileLabel: "text-ink-100/60",
    mobileBorder: "border-white/10",
    mobilePhone: "text-emerald-600",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-md bg-primary font-display text-sm font-semibold uppercase tracking-wide text-primary-foreground",
  },
  elegant: {
    shell: "bg-[#1A1410]",
    scrolledShadow: "shadow-[0_2px_24px_rgba(0,0,0,0.5)]",
    skip: "focus:bg-emerald-600 focus:text-white",
    navLink: "font-display text-[15px] text-[#B8A893] hover:text-[#F2E8DC]",
    cta: "inline-flex h-[42px] items-center rounded-lg bg-primary px-5 font-display text-sm font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90",
    ctaLabel: "Become a member",
    dropdownSurface: "bg-[#241C16] border border-[#3A2E24] rounded-lg shadow-xl",
    dropdownItem: "hover:bg-emerald-600/10",
    dropdownTitle: "text-[#F2E8DC]",
    dropdownSub: "text-[#B8A893]",
    areaAllLink: "text-emerald-600 hover:bg-emerald-600/10",
    phoneLink: "text-[#B8A893] hover:text-[#F2E8DC]",
    menuIcon: "text-[#F2E8DC]",
    logoLight: true,
    mobilePanel: "bg-[#1A1410]",
    mobileText: "text-[#F2E8DC]",
    mobileLabel: "text-[#B8A893]",
    mobileBorder: "border-[#3A2E24]",
    mobilePhone: "text-emerald-600",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary font-display text-sm font-medium tracking-wide text-primary-foreground",
  },
  "elegant-light": {
    shell: "bg-[#FBF7EF]",
    scrolledShadow: "shadow-[0_2px_16px_rgba(43,38,32,0.07)]",
    skip: "focus:bg-emerald-600 focus:text-white",
    navLink: "font-display text-[15px] text-[#8A7E6E] hover:text-[#2B2620]",
    cta: "inline-flex h-[42px] items-center rounded-lg bg-primary px-5 font-display text-sm font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90",
    ctaLabel: "Get in touch",
    dropdownSurface: "bg-white border border-[#E7DCC9] rounded-lg shadow-xl",
    dropdownItem: "hover:bg-emerald-50",
    dropdownTitle: "text-[#2B2620]",
    dropdownSub: "text-[#8A7E6E]",
    areaAllLink: "text-emerald-700 hover:bg-emerald-50",
    phoneLink: "text-[#8A7E6E] hover:text-[#2B2620]",
    menuIcon: "text-[#2B2620]",
    logoLight: false,
    mobilePanel: "bg-[#FBF7EF]",
    mobileText: "text-[#2B2620]",
    mobileLabel: "text-[#8A7E6E]",
    mobileBorder: "border-[#E7DCC9]",
    mobilePhone: "text-emerald-700",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary font-display text-sm font-medium tracking-wide text-primary-foreground",
  },
  modern: {
    shell: "bg-white",
    scrolledShadow: "shadow-[0_1px_0_0_#E6E8EC,0_2px_16px_rgba(15,23,42,0.05)]",
    skip: "focus:bg-emerald-600 focus:text-white",
    navLink: "font-display text-[15px] font-medium text-[#64748B] hover:text-[#0F172A]",
    cta: "inline-flex h-[42px] items-center rounded-xl bg-primary px-5 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90",
    ctaLabel: "Book online",
    dropdownSurface: "bg-white border border-[#E6E8EC] rounded-xl shadow-lg",
    dropdownItem: "hover:bg-[#F6F7F9]",
    dropdownTitle: "text-[#0F172A]",
    dropdownSub: "text-[#64748B]",
    areaAllLink: "text-emerald-600 hover:bg-[#F6F7F9]",
    phoneLink: "text-[#64748B] hover:text-[#0F172A]",
    menuIcon: "text-[#0F172A]",
    logoLight: false,
    mobilePanel: "bg-white",
    mobileText: "text-[#0F172A]",
    mobileLabel: "text-[#64748B]",
    mobileBorder: "border-[#E6E8EC]",
    mobilePhone: "text-emerald-600",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary font-display text-sm font-semibold text-primary-foreground",
  },
  friendly: {
    shell: "bg-[#FFFBF5]",
    scrolledShadow: "shadow-[0_2px_16px_rgba(61,53,48,0.08)]",
    skip: "focus:bg-emerald-600 focus:text-white",
    navLink: "font-display text-[15px] font-medium text-[#7A6F66] hover:text-emerald-700",
    cta: "inline-flex h-[42px] items-center rounded-2xl bg-primary px-5 font-display text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90",
    ctaLabel: "Schedule a tour",
    dropdownSurface: "bg-white border border-[#F0E6DA] rounded-2xl shadow-xl",
    dropdownItem: "hover:bg-emerald-50",
    dropdownTitle: "text-[#3D3530]",
    dropdownSub: "text-[#7A6F66]",
    areaAllLink: "text-emerald-700 hover:bg-emerald-50",
    phoneLink: "text-[#7A6F66] hover:text-emerald-700",
    menuIcon: "text-[#3D3530]",
    logoLight: false,
    mobilePanel: "bg-[#FFFBF5]",
    mobileText: "text-[#3D3530]",
    mobileLabel: "text-[#7A6F66]",
    mobileBorder: "border-[#F0E6DA]",
    mobilePhone: "text-emerald-700",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-2xl bg-primary font-display text-sm font-semibold text-primary-foreground shadow-md",
  },
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"services" | "areas" | null>(null);
  const character = (SITE as { character?: string }).character ?? "";
  const surface = (SITE as { surface?: string }).surface ?? "";
  // Elegant defaults to its LIGHT shell; surface='dark' selects the original dark
  // elegant theme (so a dark-opt-in build keeps today's shell, byte-identical).
  const themeKey =
    character === "elegant" && surface !== "dark" ? "elegant-light" : character;
  const t = HEADER_THEMES[themeKey] ?? HEADER_THEMES.default;

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
        className={`sticky top-0 z-40 ${t.shell} backdrop-blur transition-shadow ${
          scrolled ? t.scrolledShadow : ""
        }`}
      >
        <a href="#main" className={`sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 ${t.skip} focus:px-3 focus:py-1.5 focus:rounded-md`}>
          Skip to content
        </a>
        <div className="container-x flex items-center justify-between h-20">
          <Link to="/" className="focus-ring rounded-md" aria-label={`${SITE.name} home`}>
            <Logo light={t.logoLight} height={44} alt={SITE.name} />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            <div
              className="relative"
              onMouseEnter={() => setOpenMenu("services")}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className={`flex items-center gap-1 px-3 py-2 ${t.navLink} focus-ring rounded-md`}>
                Services <ChevronDown className="h-4 w-4" />
              </button>
              {openMenu === "services" && (
                <div className="absolute left-0 top-full pt-2">
                  <div className={`${t.dropdownSurface} p-2 w-72`}>
                    {SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        className={`block px-3 py-2 rounded-lg text-sm ${t.dropdownItem}`}
                      >
                        <div className={`font-medium ${t.dropdownTitle}`}>{s.name}</div>
                        {s.tagline && <div className={`text-xs ${t.dropdownSub}`}>{s.tagline}</div>}
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
              <button className={`flex items-center gap-1 px-3 py-2 ${t.navLink} focus-ring rounded-md`}>
                Areas <ChevronDown className="h-4 w-4" />
              </button>
              {openMenu === "areas" && (
                <div className="absolute left-0 top-full pt-2">
                  <div className={`${t.dropdownSurface} p-2 w-64`}>
                    {AREAS.map((a) => (
                      <Link
                        key={a.slug}
                        to="/areas/$slug"
                        params={{ slug: a.slug }}
                        className={`block px-3 py-2 rounded-lg text-sm font-medium ${t.dropdownTitle} ${t.dropdownItem}`}
                      >
                        {a.name}
                      </Link>
                    ))}
                    <Link to="/areas" className={`block px-3 py-2 rounded-lg text-sm font-medium ${t.areaAllLink}`}>
                      View all areas →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link to="/pricing" className={`px-3 py-2 ${t.navLink} focus-ring rounded-md`}>Pricing</Link>
            <Link to="/reviews" className={`px-3 py-2 ${t.navLink} focus-ring rounded-md`}>Reviews</Link>
            <Link to="/about" className={`px-3 py-2 ${t.navLink} focus-ring rounded-md`}>About</Link>
            <Link to="/contact" className={`px-3 py-2 ${t.navLink} focus-ring rounded-md`}>Contact</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:${SITE.phone}`} className={`flex items-center gap-1.5 text-sm font-semibold ${t.phoneLink} focus-ring rounded-md px-2 py-1`}>
              <Phone className="h-4 w-4" />
              {SITE.phoneDisplay}
            </a>
            <Link to="/contact" className={t.cta}>{t.ctaLabel}</Link>
          </div>

          <button
            className="lg:hidden p-2 focus-ring rounded-md"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className={`h-6 w-6 ${t.menuIcon}`} />
          </button>
        </div>
      </header>

      {open && (
        <div className={`fixed inset-0 z-[60] ${t.mobilePanel} lg:hidden overflow-y-auto`}>
          <div className="container-x flex items-center justify-between h-20">
            <Logo light={t.logoLight} height={40} alt={SITE.name} />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className={`p-2 focus-ring rounded-md ${t.menuIcon}`}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="container-x pb-12 space-y-6">
            <div>
              <div className={`text-xs font-semibold ${t.mobileLabel} uppercase tracking-wider mb-2`}>Services</div>
              {SERVICES.map((s) => (
                <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>
                  {s.name}
                </Link>
              ))}
            </div>
            <div>
              <div className={`text-xs font-semibold ${t.mobileLabel} uppercase tracking-wider mb-2`}>Areas</div>
              {AREAS.map((a) => (
                <Link key={a.slug} to="/areas/$slug" params={{ slug: a.slug }} onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>
                  {a.name}
                </Link>
              ))}
            </div>
            <div className="space-y-2">
              <Link to="/pricing" onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>Pricing</Link>
              <Link to="/reviews" onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>Reviews</Link>
              <Link to="/about" onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>About</Link>
              <Link to="/contact" onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>Contact</Link>
            </div>
            <div className={`pt-4 border-t ${t.mobileBorder} space-y-3`}>
              <a href={`tel:${SITE.phone}`} className={`flex items-center gap-2 text-base font-semibold ${t.mobilePhone}`}>
                <Phone className="h-5 w-5" /> {SITE.phoneDisplay}
              </a>
              <Link to="/contact" onClick={() => setOpen(false)} className={t.mobileCta}>
                {t.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
