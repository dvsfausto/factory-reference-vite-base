import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Logo } from "./Logo";
import { SITE } from "~/data/site";
import { PAGED_SERVICES as SERVICES } from "~/data/services-view";
import { AREAS } from "~/data/areas";
import { INFO_PAGES } from "~/data/info-pages";
import { CUSTOM_PAGES } from "~/data/custom-pages";
import defaultLeaves from "~/assets/decorative/cleaning-leaves.png";
import { tr } from "~/lib/i18n";

// PRAISE-61 — nav links hidden from the menu (design_dna.chrome.nav.hidden → SITE.hiddenNav).
// ABSENT/empty → byte-identical; filtering only, the pages still exist and are reachable by URL.
const HIDDEN_NAV: string[] = (SITE as { hiddenNav?: string[] }).hiddenNav ?? [];

// Character-aware root footer. Picks its treatment from SITE.character (emitted
// by the scaffolder only for bold/elegant). Absent → the 'default' theme below,
// whose class strings are today's verbatim markup → byte-identical for verticals
// that do not set a character.
//
// TOKEN DISCIPLINE: accent → emerald-* (DNA). Warm-dark neutral for elegant is
// hardcoded here (contained to the theme). Bold uses cool ink-* dark.
interface FooterTheme {
  surface: string;
  tagline: string;
  socialBorder: string;
  socialHover: string;
  heading: string;
  listText: string;
  listHover: string;
  areaAll: string;
  border: string;
  bottomText: string;
  bottomHover: string;
  // The dark footers use the light logo; friendly's light footer needs the dark.
  logoLight: boolean;
}

const FOOTER_THEMES: Record<string, FooterTheme> = {
  // WOW chrome (Arc 1 · Stage 2). A deep premium footer with a brand-gradient top
  // hairline + ambient brand glow (added in the markup, gated on themeKey==='wow'),
  // brand-reactive via the brand ramp. Selected by SITE.chromeStyle='wow'. Same
  // markup/content — shell-only restyle. logoLight so the logo reads on the dark.
  wow: {
    // B1: brand-derive the surface. bg-brand-900 is re-pointed by brand-theme.ts to
    // var(--color-brand-900) (the primary mixed 0.52→black — dark enough for white text on every
    // brand measured: 726/726 ≥ AA), so the footer carries the brand's own dark tone instead of a
    // fixed navy, while staying dark so the white text / borders / logoLight below remain correct.
    // A no-primary build (no ramp) falls back to the baked brand-900 default. Path-C's end-of-file
    // footer{} override still wins the cascade unchanged.
    surface: "bg-brand-900 text-white",
    tagline: "text-white/65",
    socialBorder: "border-white/20",
    socialHover: "hover:bg-white/10",
    heading: "text-white font-display tracking-wide",
    listText: "text-white/65",
    listHover: "hover:text-white",
    areaAll: "text-brand-200 hover:text-white",
    border: "border-white/10",
    bottomText: "text-white/45",
    bottomHover: "hover:text-white",
    logoLight: true,
  },
  default: {
    surface: "bg-brand-900 text-white",
    tagline: "text-white/70",
    socialBorder: "border-white/20",
    socialHover: "hover:bg-white/10",
    heading: "text-white font-sans-body uppercase tracking-wider",
    listText: "text-white/70",
    listHover: "hover:text-white",
    areaAll: "text-brand-200 hover:text-white",
    border: "border-white/10",
    bottomText: "text-white/50",
    bottomHover: "hover:text-white",
    logoLight: true,
  },
  bold: {
    surface: "bg-ink-900 text-white",
    tagline: "text-ink-100/70",
    socialBorder: "border-white/20",
    socialHover: "hover:bg-white/10",
    heading: "text-white font-display uppercase tracking-wider",
    listText: "text-ink-100/70",
    listHover: "hover:text-white",
    areaAll: "text-emerald-600 hover:text-white",
    border: "border-white/10",
    bottomText: "text-ink-100/50",
    bottomHover: "hover:text-white",
    logoLight: true,
  },
  elegant: {
    surface: "bg-[#1A1410] text-[#F2E8DC]",
    tagline: "text-[#B8A893]",
    socialBorder: "border-[#3A2E24]",
    socialHover: "hover:bg-emerald-600/10",
    heading: "text-[#F2E8DC] font-display tracking-wide",
    listText: "text-[#B8A893]",
    listHover: "hover:text-[#F2E8DC]",
    areaAll: "text-emerald-600 hover:text-[#F2E8DC]",
    border: "border-[#3A2E24]",
    bottomText: "text-[#B8A893]/70",
    bottomHover: "hover:text-[#F2E8DC]",
    logoLight: true,
  },
  "elegant-light": {
    surface: "bg-[#FBF7EF] text-[#2B2620]",
    tagline: "text-[#8A7E6E]",
    socialBorder: "border-[#E7DCC9]",
    socialHover: "hover:bg-emerald-50",
    heading: "text-[#2B2620] font-display tracking-wide",
    listText: "text-[#8A7E6E]",
    listHover: "hover:text-emerald-700",
    areaAll: "text-emerald-700 hover:text-emerald-600",
    border: "border-[#E7DCC9]",
    bottomText: "text-[#8A7E6E]",
    bottomHover: "hover:text-emerald-700",
    logoLight: false,
  },
  friendly: {
    surface: "bg-[#FFF6EC] text-[#3D3530]",
    tagline: "text-[#7A6F66]",
    socialBorder: "border-[#F0E6DA]",
    socialHover: "hover:bg-emerald-50",
    heading: "text-[#3D3530] font-display tracking-tight",
    listText: "text-[#7A6F66]",
    listHover: "hover:text-emerald-700",
    areaAll: "text-emerald-700 hover:text-emerald-600",
    border: "border-[#F0E6DA]",
    bottomText: "text-[#7A6F66]",
    bottomHover: "hover:text-emerald-700",
    logoLight: false,
  },
  corporate: {
    surface: "bg-[#142844] text-white",
    tagline: "text-white/60",
    socialBorder: "border-white/15",
    socialHover: "hover:bg-white/10",
    heading: "text-white font-display uppercase tracking-wide",
    listText: "text-white/60",
    listHover: "hover:text-white",
    areaAll: "text-emerald-100 hover:text-white",
    border: "border-white/10",
    bottomText: "text-white/40",
    bottomHover: "hover:text-white",
    logoLight: true,
  },
  creative: {
    surface: "bg-[#18181B] text-white",
    tagline: "text-white/60",
    socialBorder: "border-white/15",
    socialHover: "hover:bg-emerald-600",
    heading: "text-white font-display tracking-tight",
    listText: "text-white/60",
    listHover: "hover:text-white",
    areaAll: "text-emerald-100 hover:text-white",
    border: "border-white/10",
    bottomText: "text-white/40",
    bottomHover: "hover:text-white",
    logoLight: true,
  },
  modern: {
    surface: "bg-[#0F172A] text-white",
    tagline: "text-white/60",
    socialBorder: "border-white/15",
    socialHover: "hover:bg-white/10",
    heading: "text-white font-display tracking-tight",
    listText: "text-white/60",
    listHover: "hover:text-white",
    areaAll: "text-emerald-100 hover:text-white",
    border: "border-white/10",
    bottomText: "text-white/40",
    bottomHover: "hover:text-white",
    logoLight: true,
  },
};

export function Footer({ decorativeAsset = defaultLeaves }: { decorativeAsset?: string } = {}) {
  const year = new Date().getFullYear();
  const locationLine = [SITE.address.city, SITE.address.state]
    .filter(Boolean)
    .join(", ");
  // Bold/elegant builds set SITE.footerDecor='none' to drop the botanical leaf
  // sprite (a soft, cleaning-specific decoration). Absent → the leaf renders
  // (default; byte-identical for verticals that do not set the flag).
  const character = (SITE as { character?: string }).character ?? "";
  const surface = (SITE as { surface?: string }).surface ?? "";
  // SITE.chromeStyle mirrors the header: 'wow' selects the brand-reactive glass
  // chrome. Absent/unknown → character logic (byte-identical for builds without it).
  const chrome = (SITE as { chromeStyle?: string }).chromeStyle ?? "";
  const themeKey =
    chrome && FOOTER_THEMES[chrome]
      ? chrome
      : character === "elegant" && surface !== "dark"
        ? "elegant-light"
        : character;
  const t = FOOTER_THEMES[themeKey] ?? FOOTER_THEMES.default;
  // The botanical leaf sprite is a cleaning-specific decoration — drop it for the
  // WOW chrome (its brand glow replaces it), and honor the existing 'none' opt-out.
  const showFooterDecor =
    (SITE as { footerDecor?: string }).footerDecor !== "none" && themeKey !== "wow";

  return (
    <footer className={`relative overflow-hidden ${t.surface}`}>
      {/* WOW chrome only: a brand-gradient top hairline + one ambient brand glow,
          echoing the aurora/glass sections. Additive; no other theme renders these. */}
      {themeKey === "wow" && (
        <>
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 z-10 h-px"
            style={{ backgroundImage: "var(--wow-grad-brand)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-1/4 right-0 h-2/3 w-1/2 opacity-25"
            style={{ backgroundImage: "var(--wow-grad-brand)", filter: "blur(90px)" }}
          />
        </>
      )}
      {showFooterDecor && (
        <img src={decorativeAsset} alt="" aria-hidden className="absolute -left-16 top-0 h-full opacity-15 pointer-events-none select-none" />
      )}
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 relative">
        <div className="lg:col-span-1">
          <Logo src={SITE.logo_url} light={t.logoLight} height={48} alt={SITE.name} />
          {SITE.tagline && (
            <p className={`mt-4 text-sm ${t.tagline} leading-relaxed font-display italic`}>
              {SITE.tagline}
            </p>
          )}
          <div className="flex gap-3 mt-5">
            {SITE.social.instagram && (
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={`h-9 w-9 rounded-full border ${t.socialBorder} flex items-center justify-center ${t.socialHover} focus-ring`}>
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {SITE.social.facebook && (
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`h-9 w-9 rounded-full border ${t.socialBorder} flex items-center justify-center ${t.socialHover} focus-ring`}>
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {SITE.social.yelp && (
              <a href={SITE.social.yelp} target="_blank" rel="noopener noreferrer" aria-label="Yelp" className={`h-9 w-9 rounded-full border ${t.socialBorder} flex items-center justify-center ${t.socialHover} focus-ring text-xs font-bold`}>Y</a>
            )}
            {SITE.social.google && (
              <a href={SITE.social.google} target="_blank" rel="noopener noreferrer" aria-label="Google" className={`h-9 w-9 rounded-full border ${t.socialBorder} flex items-center justify-center ${t.socialHover} focus-ring text-xs font-bold`}>G</a>
            )}
          </div>
        </div>

        {/* Services column omitted when the site has no service pages (generic
            vertical, no owner services) — no empty "Services" header, no dead
            /services/$slug links. Runtime guard only; the route file stays. */}
        {SERVICES.length > 0 && (
          <div>
            <h4 className={`text-sm font-semibold mb-4 ${t.heading}`}>{tr('footer.services')}</h4>
            <ul className={`space-y-2 text-sm ${t.listText}`}>
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link to="/services/$slug" params={{ slug: s.slug }} className={t.listHover}>
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Service Areas column omitted when the site has no area pages (single-location
            business) — no empty "Service Areas" header, no "View all areas" link to a page
            that redirects home. Mirrors the Services guard above (runtime only; route stays). */}
        {AREAS.length > 0 && (
          <div>
            <h4 className={`text-sm font-semibold mb-4 ${t.heading}`}>{tr('footer.serviceAreas')}</h4>
            <ul className={`space-y-2 text-sm ${t.listText}`}>
              {AREAS.map((a) => (
                <li key={a.slug}>
                  <Link to="/areas/$slug" params={{ slug: a.slug }} className={t.listHover}>
                    {a.name}
                  </Link>
                </li>
              ))}
              <li><Link to="/areas" className={t.areaAll}>{tr('nav.viewAllAreas')}</Link></li>
            </ul>
          </div>
        )}

        <div>
          <h4 className={`text-sm font-semibold mb-4 ${t.heading}`}>{tr('footer.company')}</h4>
          <ul className={`space-y-2 text-sm ${t.listText}`}>
            {!HIDDEN_NAV.includes('about') && <li><Link to="/about" className={t.listHover}>{tr('footer.about')}</Link></li>}
            {!HIDDEN_NAV.includes('pricing') && <li><Link to="/pricing" className={t.listHover}>{tr('footer.pricing')}</Link></li>}
            {!HIDDEN_NAV.includes('reviews') && <li><Link to="/reviews" className={t.listHover}>{tr('footer.reviews')}</Link></li>}
            {!HIDDEN_NAV.includes('contact') && <li><Link to="/contact" className={t.listHover}>{tr('footer.contact')}</Link></li>}
            {INFO_PAGES.map((i) => (
              <li key={i.slug}>
                <Link to="/info/$slug" params={{ slug: i.slug }} className={t.listHover}>
                  {i.name}
                </Link>
              </li>
            ))}
            {/* Custom pages (Phase 2). Empty CUSTOM_PAGES → nothing renders (byte-identical). */}
            {CUSTOM_PAGES.filter((p) => p.nav !== false).map((p) => (
              <li key={p.slug}>
                <Link to="/p/$slug" params={{ slug: p.slug }} className={t.listHover}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={`text-sm font-semibold mb-4 ${t.heading}`}>{tr('footer.getInTouch')}</h4>
          <ul className={`space-y-3 text-sm ${t.listText}`}>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /><a href={`tel:${SITE.phone}`} className={t.listHover}>{SITE.phoneDisplay}</a></li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /><a href={`mailto:${SITE.email}`} className={`${t.listHover} break-all`}>{SITE.email}</a></li>
            {locationLine && (
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /><span>{locationLine}</span></li>
            )}
            {SITE.hours && (
              <li className="flex items-start gap-2"><Clock className="h-4 w-4 mt-0.5 shrink-0" /><span>{SITE.hours}</span></li>
            )}
          </ul>
        </div>
      </div>

      <div className={`border-t ${t.border} relative`}>
        <div className={`container-x py-5 flex flex-wrap items-center justify-between gap-3 text-xs ${t.bottomText}`}>
          <div>© {year} {SITE.name}</div>
          <div className="flex gap-4">
            <Link to="/contact" className={t.bottomHover}>{tr('footer.privacy')}</Link>
            <Link to="/contact" className={t.bottomHover}>{tr('footer.terms')}</Link>
            <a href="/sitemap.xml" className={t.bottomHover}>{tr('footer.sitemap')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
