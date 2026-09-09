import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { SITE, BOOKING } from "~/data/site";
import { PrimaryCta } from "~/components/blocks/PrimaryCta";
import { primaryCta } from "~/lib/primaryCta";
import { PAGED_SERVICES as SERVICES } from "~/data/services-view";
import { AREAS } from "~/data/areas";
import { CUSTOM_PAGES } from "~/data/custom-pages";
import { reviews as REVIEWS } from '~/data/reviews'
import { tr } from "~/lib/i18n";

import { HAS_PHONE } from '~/lib/phone'
// PRAISE-61 — nav links a customer chose to hide from the menu (design_dna.chrome.nav.hidden →
// SITE.hiddenNav). ABSENT/empty → nothing filtered → byte-identical to today. Filtering only; the
// pages still exist and are reachable by URL. Keys: pricing/reviews/about/contact.
const HIDDEN_NAV: string[] = [
  ...((SITE as { hiddenNav?: string[] }).hiddenNav ?? []),
  // 2026-09-04: /reviews 404s with no reviews (routes/reviews.tsx), so the link goes with it.
  ...(REVIEWS.length === 0 ? ['reviews'] : []),
];

// Character-aware root header. The shell sees SITE (not the homepage layout), so
// it picks its treatment from SITE.character (emitted by the scaffolder only for
// bold/elegant verticals). Absent → the 'default' theme below, whose class
// strings are today's verbatim markup, so verticals that do not set a character
// render byte-identically.
//
// TOKEN DISCIPLINE: CTA → bg-primary / text-primary-foreground (brand-owned).
// Accent → fam-accent-* (DNA). Warm-dark neutral for elegant is hardcoded here
// (espresso var(--color-fam-statement) / leather var(--color-fam-statement-2) / hairline var(--color-fam-statement-hairline) / cream var(--color-fam-on-statement) / taupe
// var(--color-fam-on-statement-muted)), contained to the character themes. Bold uses the cool ink-* dark.
interface HeaderTheme {
  shell: string;
  /** WOW-only: shell classes applied when scrolled (frosted glass intensifies).
   *  Absent → shell stays constant on scroll (every character theme, unchanged). */
  shellScrolled?: string;
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
  // WOW chrome (Arc 1 · Stage 2). A frosted-glass sticky header that intensifies
  // on scroll, brand-reactive via the --wow-* tokens + the brand ramp. Character-
  // agnostic: selected by SITE.chromeStyle='wow' (not a character), so it composes
  // with any brand color. CTA carries the brand gradient + glow; links + dropdowns
  // use the brand ramp; the bottom hairline is brand-tinted. Same markup/behavior
  // as every theme — shell-only restyle.
  wow: {
    shell: "bg-fam-card/70 border-b border-[color:var(--wow-hairline)]",
    shellScrolled: "bg-fam-card/85 border-b border-[color:var(--wow-hairline)] shadow-[var(--wow-shadow-soft)]",
    scrolledShadow: "",
    skip: "focus:bg-primary focus:text-primary-foreground",
    navLink: "text-[15px] font-medium text-ink-700 hover:text-brand-600 transition-colors",
    cta: "inline-flex h-[42px] items-center rounded-full px-5 text-sm font-semibold text-fam-on-dark bg-[image:var(--wow-grad-brand)] shadow-[var(--wow-shadow-glow)] transition-transform hover:-translate-y-0.5",
    ctaLabel: "Free Quote",
    dropdownSurface: "bg-fam-card/90 backdrop-blur-xl border border-[color:var(--wow-hairline)] rounded-2xl shadow-[var(--wow-shadow-soft)]",
    dropdownItem: "hover:bg-brand-50",
    dropdownTitle: "text-ink-900",
    dropdownSub: "text-ink-500",
    areaAllLink: "text-brand-600 hover:bg-brand-50",
    phoneLink: "text-ink-700 hover:text-brand-600",
    menuIcon: "text-ink-900",
    logoLight: false,
    mobilePanel: "bg-fam-card/95 backdrop-blur-xl",
    mobileText: "text-ink-900",
    mobileLabel: "text-ink-500",
    mobileBorder: "border-[color:var(--wow-hairline)]",
    mobilePhone: "text-brand-600",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-full text-fam-on-dark font-semibold bg-[image:var(--wow-grad-brand)] shadow-[var(--wow-shadow-glow)]",
  },
  default: {
    shell: "bg-fam-card/95",
    scrolledShadow: "shadow-[0_2px_16px_rgba(11,42,91,0.08)]",
    skip: "focus:bg-brand-600 focus:text-fam-on-dark",
    navLink: "text-[15px] font-medium text-ink-700 hover:text-brand-600",
    cta: "btn btn-md btn-primary",
    ctaLabel: "Free Quote",
    dropdownSurface: "bg-fam-card border border-ink-100 rounded-2xl shadow-xl",
    dropdownItem: "hover:bg-brand-50",
    dropdownTitle: "text-ink-900",
    dropdownSub: "text-ink-500",
    areaAllLink: "text-brand-600 hover:bg-brand-50",
    phoneLink: "text-ink-700 hover:text-brand-600",
    menuIcon: "text-ink-900",
    logoLight: false,
    mobilePanel: "bg-fam-card",
    mobileText: "text-ink-900",
    mobileLabel: "text-ink-500",
    mobileBorder: "border-ink-100",
    mobilePhone: "text-brand-600",
    mobileCta: "btn btn-lg btn-primary w-full",
  },
  bold: {
    shell: "bg-ink-900",
    scrolledShadow: "shadow-[0_2px_16px_rgba(0,0,0,0.45)]",
    skip: "focus:bg-fam-accent focus:text-fam-on-dark",
    navLink: "font-display text-sm font-semibold uppercase tracking-wide text-ink-100 hover:text-fam-on-dark",
    cta: "inline-flex h-[42px] items-center rounded-md bg-primary px-5 font-display text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90",
    ctaLabel: "Free Quote",
    dropdownSurface: "bg-ink-900 border border-fam-card/10 rounded-md shadow-xl",
    dropdownItem: "hover:bg-fam-card/5",
    dropdownTitle: "text-ink-100",
    dropdownSub: "text-ink-100/60",
    areaAllLink: "text-fam-accent-text hover:bg-fam-card/5",
    phoneLink: "text-ink-100 hover:text-fam-on-dark",
    menuIcon: "text-fam-on-dark",
    logoLight: true,
    mobilePanel: "bg-ink-900",
    mobileText: "text-ink-100",
    mobileLabel: "text-ink-100/60",
    mobileBorder: "border-fam-card/10",
    mobilePhone: "text-fam-accent-text",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-md bg-primary font-display text-sm font-semibold uppercase tracking-wide text-primary-foreground",
  },
  elegant: {
    shell: "bg-fam-statement",
    scrolledShadow: "shadow-[0_2px_24px_rgba(0,0,0,0.5)]",
    skip: "focus:bg-fam-accent focus:text-fam-on-dark",
    navLink: "font-display text-[15px] text-fam-on-statement-muted hover:text-fam-on-statement",
    cta: "inline-flex h-[42px] items-center rounded-lg bg-primary px-5 font-display text-sm font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90",
    ctaLabel: "Free Quote",
    dropdownSurface: "bg-fam-statement-2 border border-fam-statement-hairline rounded-lg shadow-xl",
    dropdownItem: "hover:bg-fam-accent/10",
    dropdownTitle: "text-fam-on-statement",
    dropdownSub: "text-fam-on-statement-muted",
    areaAllLink: "text-fam-accent-text hover:bg-fam-accent/10",
    phoneLink: "text-fam-on-statement-muted hover:text-fam-on-statement",
    menuIcon: "text-fam-on-statement",
    logoLight: true,
    mobilePanel: "bg-fam-statement",
    mobileText: "text-fam-on-statement",
    mobileLabel: "text-fam-on-statement-muted",
    mobileBorder: "border-fam-statement-hairline",
    mobilePhone: "text-fam-accent-text",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary font-display text-sm font-medium tracking-wide text-primary-foreground",
  },
  "elegant-light": {
    shell: "bg-fam-surface",
    scrolledShadow: "shadow-[0_2px_16px_rgba(43,38,32,0.07)]",
    skip: "focus:bg-fam-accent focus:text-fam-on-dark",
    navLink: "font-display text-[15px] text-fam-ink-muted hover:text-fam-ink",
    cta: "inline-flex h-[42px] items-center rounded-lg bg-primary px-5 font-display text-sm font-medium tracking-wide text-primary-foreground transition-opacity hover:opacity-90",
    ctaLabel: "Get in touch",
    dropdownSurface: "bg-fam-card border border-fam-hairline rounded-lg shadow-xl",
    dropdownItem: "hover:bg-fam-accent-soft",
    dropdownTitle: "text-fam-ink",
    dropdownSub: "text-fam-ink-muted",
    areaAllLink: "text-fam-accent-text-strong hover:bg-fam-accent-soft",
    phoneLink: "text-fam-ink-muted hover:text-fam-ink",
    menuIcon: "text-fam-ink",
    logoLight: false,
    mobilePanel: "bg-fam-surface",
    mobileText: "text-fam-ink",
    mobileLabel: "text-fam-ink-muted",
    mobileBorder: "border-fam-hairline",
    mobilePhone: "text-fam-accent-text-strong",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary font-display text-sm font-medium tracking-wide text-primary-foreground",
  },
  modern: {
    shell: "bg-fam-card",
    scrolledShadow: "shadow-[0_1px_0_0_#E6E8EC,0_2px_16px_rgba(15,23,42,0.05)]",
    skip: "focus:bg-fam-accent focus:text-fam-on-dark",
    navLink: "font-display text-[15px] font-medium text-fam-ink-muted hover:text-fam-ink",
    cta: "inline-flex h-[42px] items-center rounded-xl bg-primary px-5 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90",
    ctaLabel: "Free Quote",
    dropdownSurface: "bg-fam-card border border-fam-hairline rounded-xl shadow-lg",
    dropdownItem: "hover:bg-fam-surface-2",
    dropdownTitle: "text-fam-ink",
    dropdownSub: "text-fam-ink-muted",
    areaAllLink: "text-fam-accent-text hover:bg-fam-surface-2",
    phoneLink: "text-fam-ink-muted hover:text-fam-ink",
    menuIcon: "text-fam-ink",
    logoLight: false,
    mobilePanel: "bg-fam-card",
    mobileText: "text-fam-ink",
    mobileLabel: "text-fam-ink-muted",
    mobileBorder: "border-fam-hairline",
    mobilePhone: "text-fam-accent-text",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary font-display text-sm font-semibold text-primary-foreground",
  },
  corporate: {
    shell: "bg-fam-card",
    scrolledShadow: "shadow-[0_1px_0_0_#D8DEE7,0_2px_12px_rgba(26,36,51,0.05)]",
    skip: "focus:bg-fam-accent focus:text-fam-on-dark",
    navLink: "font-display text-[15px] font-medium text-fam-ink hover:text-fam-accent-text-strong",
    cta: "inline-flex h-[42px] items-center rounded-md bg-primary px-5 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90",
    ctaLabel: "Free Quote",
    dropdownSurface: "bg-fam-card border border-fam-hairline rounded-md shadow-lg",
    dropdownItem: "hover:bg-fam-surface-2",
    dropdownTitle: "text-fam-ink",
    dropdownSub: "text-fam-ink-muted",
    areaAllLink: "text-fam-accent-text-strong hover:bg-fam-surface-2",
    phoneLink: "text-fam-ink hover:text-fam-accent-text-strong",
    menuIcon: "text-fam-ink",
    logoLight: false,
    mobilePanel: "bg-fam-card",
    mobileText: "text-fam-ink",
    mobileLabel: "text-fam-ink-muted",
    mobileBorder: "border-fam-hairline",
    mobilePhone: "text-fam-accent-text-strong",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-md bg-primary font-display text-sm font-semibold text-primary-foreground",
  },
  creative: {
    shell: "bg-fam-card",
    scrolledShadow: "shadow-[0_2px_20px_rgba(24,24,27,0.06)]",
    skip: "focus:bg-fam-accent focus:text-fam-on-dark",
    navLink: "font-display text-[15px] font-bold text-fam-ink hover:text-fam-accent-text-strong",
    cta: "inline-flex h-[44px] items-center rounded-2xl bg-primary px-5 font-display text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5",
    ctaLabel: "Start a project",
    dropdownSurface: "bg-fam-card border border-fam-hairline rounded-2xl shadow-xl",
    dropdownItem: "hover:bg-fam-surface-2",
    dropdownTitle: "text-fam-ink",
    dropdownSub: "text-fam-ink-muted",
    areaAllLink: "text-fam-accent-text-strong hover:bg-fam-surface-2",
    phoneLink: "text-fam-ink hover:text-fam-accent-text-strong",
    menuIcon: "text-fam-ink",
    logoLight: false,
    mobilePanel: "bg-fam-card",
    mobileText: "text-fam-ink",
    mobileLabel: "text-fam-ink-muted",
    mobileBorder: "border-fam-hairline",
    mobilePhone: "text-fam-accent-text-strong",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-2xl bg-primary font-display text-sm font-bold text-primary-foreground",
  },
  // 'clean' family (Swiss-minimal, cool light). Standard bar; the header analog of the footer's
  // clean theme (bg #F7F8FA, hairline #E2E8F0, slate text, emerald accent) so a clean site's header
  // and footer agree instead of the header falling to the navy default.
  clean: {
    shell: "bg-fam-surface",
    scrolledShadow: "shadow-[0_1px_0_0_#E2E8F0,0_2px_14px_rgba(30,41,59,0.05)]",
    skip: "focus:bg-fam-accent focus:text-fam-on-dark",
    navLink: "font-display text-[15px] font-medium text-fam-ink-muted hover:text-fam-ink",
    cta: "inline-flex h-[42px] items-center rounded-lg bg-primary px-5 font-display text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90",
    ctaLabel: "Free Quote",
    dropdownSurface: "bg-fam-card border border-fam-hairline rounded-lg shadow-lg",
    dropdownItem: "hover:bg-fam-surface-4",
    dropdownTitle: "text-fam-ink",
    dropdownSub: "text-fam-ink-muted",
    areaAllLink: "text-fam-accent-text-strong hover:bg-fam-surface-4",
    phoneLink: "text-fam-ink-muted hover:text-fam-ink",
    menuIcon: "text-fam-ink",
    logoLight: false,
    mobilePanel: "bg-fam-surface",
    mobileText: "text-fam-ink",
    mobileLabel: "text-fam-ink-muted",
    mobileBorder: "border-fam-hairline",
    mobilePhone: "text-fam-accent-text-strong",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary font-display text-sm font-semibold text-primary-foreground",
  },
  friendly: {
    shell: "bg-fam-surface",
    scrolledShadow: "shadow-[0_2px_16px_rgba(61,53,48,0.08)]",
    skip: "focus:bg-fam-accent focus:text-fam-on-dark",
    navLink: "font-display text-[15px] font-medium text-fam-ink-muted hover:text-fam-accent-text-strong",
    cta: "inline-flex h-[42px] items-center rounded-2xl bg-primary px-5 font-display text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90",
    ctaLabel: "Free Quote",
    dropdownSurface: "bg-fam-card border border-fam-hairline rounded-2xl shadow-xl",
    dropdownItem: "hover:bg-fam-accent-soft",
    dropdownTitle: "text-fam-ink",
    dropdownSub: "text-fam-ink-muted",
    areaAllLink: "text-fam-accent-text-strong hover:bg-fam-accent-soft",
    phoneLink: "text-fam-ink-muted hover:text-fam-accent-text-strong",
    menuIcon: "text-fam-ink",
    logoLight: false,
    mobilePanel: "bg-fam-surface",
    mobileText: "text-fam-ink",
    mobileLabel: "text-fam-ink-muted",
    mobileBorder: "border-fam-hairline",
    mobilePhone: "text-fam-accent-text-strong",
    mobileCta: "inline-flex h-12 w-full items-center justify-center rounded-2xl bg-primary font-display text-sm font-semibold text-primary-foreground shadow-md",
  },
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"services" | "areas" | null>(null);
  const character = (SITE as { character?: string }).character ?? "";
  const surface = (SITE as { surface?: string }).surface ?? "";
  // SITE.chromeStyle is the frame (header/footer) style override — 'wow' selects
  // the brand-reactive glass chrome, independent of character. Absent/unknown →
  // the character logic below (byte-identical for builds that don't set it).
  const chrome = (SITE as { chromeStyle?: string }).chromeStyle ?? "";
  // DESIGN-WAVE FAMILY (SITE.headerVariant) — the SAME emit path as SITE.footerVariant. Absent on every
  // legacy character/vertical site, so those fall through to the character/chrome logic below and render
  // byte-identically. When present it drives BOTH axes:
  //   • STRUCTURE — a real structural difference, NOT a token swap (the footer lesson). elegant → a centred
  //     two-tier editorial masthead; corporate → a utility strip (real fields only) above the main bar;
  //     every other family → today's standard left-logo bar in its own colours.
  //   • COLOUR THEME — the family's HEADER_THEMES entry (elegant maps to the light editorial palette).
  const family = (SITE as { headerVariant?: string }).headerVariant ?? "";
  const structure: "standard" | "editorial" | "utility" =
    family === "elegant" ? "editorial" : family === "corporate" ? "utility" : "standard";
  // Family → colour-theme key. Most families share their name; two remap: elegant → the LIGHT editorial
  // palette (the dark espresso theme is opt-in via character+surface), and wow-glass → the brand-reactive
  // 'wow' glass theme (keyed by name here since the design wave sets no chromeStyle). Keeps header theme
  // coverage 1:1 with the footer's, so no family falls to the navy default while its footer is light/glass.
  const familyThemeKey =
    family === "elegant" ? "elegant-light" : family === "wow-glass" ? "wow" : family;
  const themeKey =
    chrome && HEADER_THEMES[chrome]
      ? chrome
      : family && HEADER_THEMES[familyThemeKey]
        ? familyThemeKey
        : character === "elegant" && surface !== "dark"
          ? "elegant-light"
          : character;
  const t = HEADER_THEMES[themeKey] ?? HEADER_THEMES.default;
  // Header CTA reflects the business's TRANSACTION TYPE — booking businesses shouldn't
  // show "Free Quote". Infer it from the hero's primary CTA (set per-vertical/onboarding:
  // "Book Your Visit" → booking, "Request a quote" → quote) so header + hero are CONSISTENT.
  // The header CTA label comes from the AFFORDANCE (primaryCta().label — "Get a quote" / "Book now" /
  // "Shop"), so it's correct on arrival with no owner setup and never leaks the generic contact label.
  // An explicit emitted/edited SITE.headerCtaLabel/ctaLabel (design_dna) still wins. The theme default
  // (t.ctaLabel) is the last resort only when there is genuinely no affordance.
  const headerCtaLabel =
    (SITE as { headerCtaLabel?: string; ctaLabel?: string }).headerCtaLabel ??
    (SITE as { ctaLabel?: string }).ctaLabel ??
    primaryCta().label ??
    t.ctaLabel;

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

  // ── Shared primitives, composed differently per STRUCTURE ─────────────────────
  // The desktop nav links (dropdowns + page links). `dropAlign` positions the
  // dropdown panel — `left-0` under a left-aligned bar, centred under the editorial
  // masthead's centred nav row so the panel doesn't hang off-screen.
  const navLinks = (dropAlign = "left-0") => (
    <>
      {/* Services nav omitted when the site has no service pages (e.g. a
          generic-vertical business whose owner supplied none) — no empty
          dropdown, no dead /services link. Mirrors the AREAS guard below. */}
      {SERVICES.length > 0 && (
        <div
          className="relative"
          onMouseEnter={() => setOpenMenu("services")}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button className={`flex items-center gap-1 px-3 py-2 ${t.navLink} focus-ring rounded-md`}>
            {tr('nav.services')} <ChevronDown className="h-4 w-4" />
          </button>
          {openMenu === "services" && (
            <div className={`absolute ${dropAlign} top-full pt-2`}>
              <div className={`${t.dropdownSurface} p-2 w-72`}>
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className={`block px-3 py-2 rounded-lg text-sm ${t.dropdownItem}`}
                  >
                    <div className={`font-medium ${t.dropdownTitle}`}>{s.displayName}</div>
                    {s.tagline && <div className={`text-xs ${t.dropdownSub}`}>{s.tagline}</div>}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Areas nav omitted when the site has no service-area pages (e.g. a
          single-area business) — no empty dropdown, no dead /areas link. */}
      {AREAS.length > 0 && (
        <div
          className="relative"
          onMouseEnter={() => setOpenMenu("areas")}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button className={`flex items-center gap-1 px-3 py-2 ${t.navLink} focus-ring rounded-md`}>
            {tr('nav.areas')} <ChevronDown className="h-4 w-4" />
          </button>
          {openMenu === "areas" && (
            <div className={`absolute ${dropAlign} top-full pt-2`}>
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
                  {tr('nav.viewAllAreas')}
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {!HIDDEN_NAV.includes('pricing') && <Link to="/pricing" className={`px-3 py-2 ${t.navLink} focus-ring rounded-md`}>{tr('nav.pricing')}</Link>}
      {!HIDDEN_NAV.includes('reviews') && <Link to="/reviews" className={`px-3 py-2 ${t.navLink} focus-ring rounded-md`}>{tr('nav.reviews')}</Link>}
      {!HIDDEN_NAV.includes('about') && <Link to="/about" className={`px-3 py-2 ${t.navLink} focus-ring rounded-md`}>{tr('nav.about')}</Link>}
      {!HIDDEN_NAV.includes('contact') && <Link to="/contact" className={`px-3 py-2 ${t.navLink} focus-ring rounded-md`}>{tr('nav.contact')}</Link>}
      {/* Custom pages (Phase 2). Empty CUSTOM_PAGES → nothing renders (byte-identical). */}
      {CUSTOM_PAGES.filter((p) => p.nav !== false).map((p) => (
        <Link key={p.slug} to="/p/$slug" params={{ slug: p.slug }} className={`px-3 py-2 ${t.navLink} focus-ring rounded-md`}>{p.title}</Link>
      ))}
    </>
  );

  const phoneCluster = HAS_PHONE && (
    <a href={`tel:${SITE.phone}`} className={`flex items-center gap-1.5 text-sm font-semibold ${t.phoneLink} focus-ring rounded-md px-2 py-1`}>
      <Phone className="h-4 w-4" />
      {SITE.phoneDisplay}
    </a>
  );
  const ctaButton = <PrimaryCta className={t.cta}>{headerCtaLabel}</PrimaryCta>;
  const mobileTrigger = (
    <button
      className="lg:hidden p-2 focus-ring rounded-md"
      onClick={() => setOpen(true)}
      aria-label={tr('nav.openMenu')}
    >
      <Menu className={`h-6 w-6 ${t.menuIcon}`} />
    </button>
  );
  const skipLink = (
    <a href="#main" className={`sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 ${t.skip} focus:px-3 focus:py-1.5 focus:rounded-md`}>
      {tr('nav.skipToContent')}
    </a>
  );

  // Real, honest meta the utility strip / masthead can show — only fields that
  // exist. No invented stats, no fake credential logos (the corporate honesty rail).
  const cityLine = [SITE.address?.city, SITE.address?.state].filter(Boolean).join(", ");

  return (
    <>
      <header
        data-header-structure={structure}
        data-header-theme={themeKey || "default"}
        className={`sticky top-0 z-40 ${
          scrolled && t.shellScrolled ? t.shellScrolled : t.shell
        } backdrop-blur ${t.shellScrolled ? "transition-all" : "transition-shadow"} ${
          scrolled ? t.scrolledShadow : ""
        }`}
      >
        {skipLink}

        {structure === "standard" && (
          <div className="container-x flex items-center justify-between h-20">
            <Link to="/" className="focus-ring rounded-md" aria-label={`${SITE.name} ${tr('nav.homeLink')}`}>
              <Logo src={SITE.logo_url} light={t.logoLight} height={44} alt={SITE.name} />
            </Link>
            <nav className="hidden lg:flex items-center gap-1" aria-label={tr('nav.ariaPrimary')}>
              {navLinks()}
            </nav>
            <div className="hidden lg:flex items-center gap-3">
              {phoneCluster}
              {ctaButton}
            </div>
            {mobileTrigger}
          </div>
        )}

        {structure === "editorial" && (
          // EDITORIAL MASTHEAD (elegant) — a genuinely different STRUCTURE, not a tighter nav: symmetric and
          // centred, two tiers. Top tier is a 3-column masthead (place/hours flanking a CENTRED wordmark,
          // actions on the right); a hairline separates a CENTRED nav row beneath. Collapses to a plain bar on
          // mobile. Reads like a printed masthead, which no other family's header does.
          <div className="container-x">
            <div className="flex lg:hidden items-center justify-between h-20">
              <Link to="/" className="focus-ring rounded-md" aria-label={`${SITE.name} ${tr('nav.homeLink')}`}>
                <Logo src={SITE.logo_url} light={t.logoLight} height={40} alt={SITE.name} />
              </Link>
              {mobileTrigger}
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-3 items-center h-20">
                <div className={`justify-self-start text-[11px] uppercase tracking-[0.22em] ${t.mobileLabel}`}>
                  {cityLine || SITE.hours}
                </div>
                <Link to="/" className="justify-self-center focus-ring rounded-md" aria-label={`${SITE.name} ${tr('nav.homeLink')}`}>
                  <Logo src={SITE.logo_url} light={t.logoLight} height={46} alt={SITE.name} />
                </Link>
                <div className="justify-self-end flex items-center gap-4">
                  {phoneCluster}
                  {ctaButton}
                </div>
              </div>
              <nav className={`flex items-center justify-center gap-7 border-t ${t.mobileBorder} h-12`} aria-label={tr('nav.ariaPrimary')}>
                {navLinks("left-1/2 -translate-x-1/2")}
              </nav>
            </div>
          </div>
        )}

        {structure === "utility" && (
          // UTILITY BAR (corporate) — a thin top strip of REAL contact facts (hours · location · email ·
          // phone) above the main nav bar. A structural device that reads "established / businesslike" and
          // adds honest trust density without a single invented stat or fake credential logo. The strip is
          // desktop-only; mobile collapses to the plain bar + drawer.
          <>
            <div className={`hidden lg:block border-b ${t.mobileBorder} bg-fam-surface-2`}>
              <div className={`container-x flex items-center justify-between h-9 text-xs ${t.mobileLabel}`}>
                <div className="flex items-center gap-6">
                  {SITE.hours && <span>{SITE.hours}</span>}
                  {cityLine && <span>{cityLine}</span>}
                </div>
                <div className="flex items-center gap-6">
                  {SITE.email && <a href={`mailto:${SITE.email}`} className="hover:underline">{SITE.email}</a>}
                  {HAS_PHONE && (<a href={`tel:${SITE.phone}`} className={`font-semibold ${t.phoneLink}`}>{SITE.phoneDisplay}</a>)}
                </div>
              </div>
            </div>
            <div className="container-x flex items-center justify-between h-[72px]">
              <Link to="/" className="focus-ring rounded-md" aria-label={`${SITE.name} ${tr('nav.homeLink')}`}>
                <Logo src={SITE.logo_url} light={t.logoLight} height={42} alt={SITE.name} />
              </Link>
              <nav className="hidden lg:flex items-center gap-1" aria-label={tr('nav.ariaPrimary')}>
                {navLinks()}
              </nav>
              <div className="hidden lg:flex items-center gap-3">
                {ctaButton}
              </div>
              {mobileTrigger}
            </div>
          </>
        )}
      </header>

      {open && (
        <div className={`fixed inset-0 z-[60] ${t.mobilePanel} lg:hidden overflow-y-auto`}>
          <div className="container-x flex items-center justify-between h-20">
            <Logo src={SITE.logo_url} light={t.logoLight} height={40} alt={SITE.name} />
            <button onClick={() => setOpen(false)} aria-label={tr('nav.closeMenu')} className={`p-2 focus-ring rounded-md ${t.menuIcon}`}>
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="container-x pb-12 space-y-6">
            {SERVICES.length > 0 && (
              <div>
                <div className={`text-xs font-semibold ${t.mobileLabel} uppercase tracking-wider mb-2`}>{tr('nav.services')}</div>
                {SERVICES.map((s) => (
                  <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>
                    {s.displayName}
                  </Link>
                ))}
              </div>
            )}
            {AREAS.length > 0 && (
              <div>
                <div className={`text-xs font-semibold ${t.mobileLabel} uppercase tracking-wider mb-2`}>{tr('nav.areas')}</div>
                {AREAS.map((a) => (
                  <Link key={a.slug} to="/areas/$slug" params={{ slug: a.slug }} onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>
                    {a.name}
                  </Link>
                ))}
              </div>
            )}
            <div className="space-y-2">
              {!HIDDEN_NAV.includes('pricing') && <Link to="/pricing" onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>{tr('nav.pricing')}</Link>}
              {!HIDDEN_NAV.includes('reviews') && <Link to="/reviews" onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>{tr('nav.reviews')}</Link>}
              {!HIDDEN_NAV.includes('about') && <Link to="/about" onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>{tr('nav.about')}</Link>}
              {!HIDDEN_NAV.includes('contact') && <Link to="/contact" onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>{tr('nav.contact')}</Link>}
              {CUSTOM_PAGES.filter((p) => p.nav !== false).map((p) => (
                <Link key={p.slug} to="/p/$slug" params={{ slug: p.slug }} onClick={() => setOpen(false)} className={`block py-2 text-base font-medium ${t.mobileText}`}>{p.title}</Link>
              ))}
            </div>
            <div className={`pt-4 border-t ${t.mobileBorder} space-y-3`}>
              {HAS_PHONE && (<a href={`tel:${SITE.phone}`} className={`flex items-center gap-2 text-base font-semibold ${t.mobilePhone}`}>
                <Phone className="h-5 w-5" /> {SITE.phoneDisplay}
              </a>)}
              <PrimaryCta onClick={() => setOpen(false)} className={t.mobileCta}>
                {headerCtaLabel}
              </PrimaryCta>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
