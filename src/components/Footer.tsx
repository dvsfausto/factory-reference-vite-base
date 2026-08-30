import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { SITE } from "~/data/site";
import { PAGED_SERVICES as SERVICES } from "~/data/services-view";
import { AREAS } from "~/data/areas";
import { INFO_PAGES } from "~/data/info-pages";
import { CUSTOM_PAGES } from "~/data/custom-pages";
import defaultLeaves from "~/assets/decorative/cleaning-leaves.png";
import { tr } from "~/lib/i18n";

const HIDDEN_NAV: string[] = (SITE as { hiddenNav?: string[] }).hiddenNav ?? [];

// ─── FOOTER = family-differentiated CHROME. ───────────────────────────────────────────────────────────
// The footer was ONE 5-column grid with per-character COLOR themes — so under the style-family system (which
// sets no SITE.character) six of eight families fell to the identical default footer: a whole section shared
// across most sites. Now it's a real VARIANT system: distinct STRUCTURES (columns / editorial / cta-band /
// minimal), each themed, selected per family. Backward-compat: no footerVariant + no character + no chromeStyle
// → the 'columns' structure with the 'default' theme = today's verbatim markup (byte-identical).

interface FooterTheme {
  surface: string; tagline: string; socialBorder: string; socialHover: string; heading: string;
  listText: string; listHover: string; areaAll: string; border: string; bottomText: string; bottomHover: string;
  logoLight: boolean;
}

const FOOTER_THEMES: Record<string, FooterTheme> = {
  wow: { surface: "bg-brand-900 text-white", tagline: "text-white/65", socialBorder: "border-white/20", socialHover: "hover:bg-white/10", heading: "text-white font-display tracking-wide", listText: "text-white/65", listHover: "hover:text-white", areaAll: "text-brand-200 hover:text-white", border: "border-white/10", bottomText: "text-white/45", bottomHover: "hover:text-white", logoLight: true },
  default: { surface: "bg-brand-900 text-white", tagline: "text-white/70", socialBorder: "border-white/20", socialHover: "hover:bg-white/10", heading: "text-white font-sans-body uppercase tracking-wider", listText: "text-white/70", listHover: "hover:text-white", areaAll: "text-brand-200 hover:text-white", border: "border-white/10", bottomText: "text-white/50", bottomHover: "hover:text-white", logoLight: true },
  bold: { surface: "bg-ink-900 text-white", tagline: "text-ink-100/70", socialBorder: "border-white/20", socialHover: "hover:bg-white/10", heading: "text-white font-display uppercase tracking-wider", listText: "text-ink-100/70", listHover: "hover:text-white", areaAll: "text-emerald-600 hover:text-white", border: "border-white/10", bottomText: "text-ink-100/50", bottomHover: "hover:text-white", logoLight: true },
  elegant: { surface: "bg-[#FBF7EF] text-[#2B2620]", tagline: "text-[#8A7E6E]", socialBorder: "border-[#E7DCC9]", socialHover: "hover:bg-emerald-50", heading: "text-[#2B2620] font-display tracking-wide", listText: "text-[#8A7E6E]", listHover: "hover:text-emerald-700", areaAll: "text-emerald-700 hover:text-emerald-600", border: "border-[#E7DCC9]", bottomText: "text-[#8A7E6E]", bottomHover: "hover:text-emerald-700", logoLight: false },
  friendly: { surface: "bg-[#FFF6EC] text-[#3D3530]", tagline: "text-[#7A6F66]", socialBorder: "border-[#F0E6DA]", socialHover: "hover:bg-emerald-50", heading: "text-[#3D3530] font-display tracking-tight", listText: "text-[#7A6F66]", listHover: "hover:text-emerald-700", areaAll: "text-emerald-700 hover:text-emerald-600", border: "border-[#F0E6DA]", bottomText: "text-[#7A6F66]", bottomHover: "hover:text-emerald-700", logoLight: false },
  corporate: { surface: "bg-[#142844] text-white", tagline: "text-white/60", socialBorder: "border-white/15", socialHover: "hover:bg-white/10", heading: "text-white font-display uppercase tracking-wide", listText: "text-white/60", listHover: "hover:text-white", areaAll: "text-emerald-100 hover:text-white", border: "border-white/10", bottomText: "text-white/40", bottomHover: "hover:text-white", logoLight: true },
  creative: { surface: "bg-[#18181B] text-white", tagline: "text-white/60", socialBorder: "border-white/15", socialHover: "hover:bg-emerald-600", heading: "text-white font-display tracking-tight", listText: "text-white/60", listHover: "hover:text-white", areaAll: "text-emerald-100 hover:text-white", border: "border-white/10", bottomText: "text-white/40", bottomHover: "hover:text-white", logoLight: true },
  modern: { surface: "bg-[#0F172A] text-white", tagline: "text-white/60", socialBorder: "border-white/15", socialHover: "hover:bg-white/10", heading: "text-white font-display tracking-tight", listText: "text-white/60", listHover: "hover:text-white", areaAll: "text-emerald-100 hover:text-white", border: "border-white/10", bottomText: "text-white/40", bottomHover: "hover:text-white", logoLight: true },
  clean: { surface: "bg-[#F7F8FA] text-[#1E293B]", tagline: "text-[#64748B]", socialBorder: "border-[#E2E8F0]", socialHover: "hover:bg-emerald-50", heading: "text-[#1E293B] font-display tracking-tight", listText: "text-[#64748B]", listHover: "hover:text-emerald-700", areaAll: "text-emerald-700 hover:text-emerald-600", border: "border-[#E2E8F0]", bottomText: "text-[#64748B]", bottomHover: "hover:text-emerald-700", logoLight: false },
};

// family (or legacy character/chrome) → { structure, theme }. The four STRUCTURES are genuinely different
// footer compositions, not one grid recolored.
type FooterStructure = "columns" | "editorial" | "ctaBand" | "minimal";
const FOOTER_VARIANTS: Record<string, { structure: FooterStructure; theme: string }> = {
  "wow-glass": { structure: "columns", theme: "wow" },
  clean: { structure: "columns", theme: "clean" },
  corporate: { structure: "columns", theme: "corporate" },
  creative: { structure: "columns", theme: "creative" },
  bold: { structure: "ctaBand", theme: "bold" },
  friendly: { structure: "ctaBand", theme: "friendly" },
  modern: { structure: "minimal", theme: "modern" },
  elegant: { structure: "editorial", theme: "elegant" },
};

const locationLine = () => [SITE.address.city, SITE.address.state].filter(Boolean).join(", ");

// ─── shared column pieces (composed by the structures) ─────────────────────────────────────────────────
function SocialRow({ t }: { t: FooterTheme }) {
  const cls = `h-9 w-9 rounded-full border ${t.socialBorder} flex items-center justify-center ${t.socialHover} focus-ring transition-colors`;
  return (
    <div className="flex gap-3">
      {SITE.social.instagram && <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={cls}><Instagram className="h-4 w-4" /></a>}
      {SITE.social.facebook && <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={cls}><Facebook className="h-4 w-4" /></a>}
      {SITE.social.yelp && <a href={SITE.social.yelp} target="_blank" rel="noopener noreferrer" aria-label="Yelp" className={`${cls} text-xs font-bold`}>Y</a>}
      {SITE.social.google && <a href={SITE.social.google} target="_blank" rel="noopener noreferrer" aria-label="Google" className={`${cls} text-xs font-bold`}>G</a>}
    </div>
  );
}
function ServicesCol({ t }: { t: FooterTheme }) {
  if (SERVICES.length === 0) return null;
  return (
    <div>
      <h4 className={`text-sm font-semibold mb-4 ${t.heading}`}>{tr('footer.services')}</h4>
      <ul className={`space-y-2 text-sm ${t.listText}`}>{SERVICES.map((s) => (<li key={s.slug}><Link to="/services/$slug" params={{ slug: s.slug }} className={t.listHover}>{s.displayName}</Link></li>))}</ul>
    </div>
  );
}
function AreasCol({ t }: { t: FooterTheme }) {
  if (AREAS.length === 0) return null;
  return (
    <div>
      <h4 className={`text-sm font-semibold mb-4 ${t.heading}`}>{tr('footer.serviceAreas')}</h4>
      <ul className={`space-y-2 text-sm ${t.listText}`}>{AREAS.map((a) => (<li key={a.slug}><Link to="/areas/$slug" params={{ slug: a.slug }} className={t.listHover}>{a.name}</Link></li>))}<li><Link to="/areas" className={t.areaAll}>{tr('nav.viewAllAreas')}</Link></li></ul>
    </div>
  );
}
/** Owner-made pages that ARE a legal page, matched on the slug. Empty on almost every site today. */
const LEGAL_PAGES = CUSTOM_PAGES.filter((p) => /privacy|terms|legal|aviso|privacidad|terminos/i.test(p.slug));

function CompanyCol({ t }: { t: FooterTheme }) {
  return (
    <div>
      <h4 className={`text-sm font-semibold mb-4 ${t.heading}`}>{tr('footer.company')}</h4>
      <ul className={`space-y-2 text-sm ${t.listText}`}>
        {!HIDDEN_NAV.includes('about') && <li><Link to="/about" className={t.listHover}>{tr('footer.about')}</Link></li>}
        {!HIDDEN_NAV.includes('pricing') && <li><Link to="/pricing" className={t.listHover}>{tr('footer.pricing')}</Link></li>}
        {!HIDDEN_NAV.includes('reviews') && <li><Link to="/reviews" className={t.listHover}>{tr('footer.reviews')}</Link></li>}
        {!HIDDEN_NAV.includes('contact') && <li><Link to="/contact" className={t.listHover}>{tr('footer.contact')}</Link></li>}
        {/**
          * ⚠️ INFO PAGES ARE NOT COMPANY PAGES. They were listed here beside About / Pricing /
          * Reviews / Contact, so "What to Expect When You Work With Us" and "Questions to Ask
          * Before You Hire" read as corporate links — the reported "blog pages in the company
          * section… it looks somehow". They are guides, so they get their own labelled group
          * rather than a fifth column (the grid is already 5-up on desktop and 4-up on the
          * compact variant; adding one would reflow both).
          * ★ CUSTOM pages stay in Company: an owner-created page IS theirs, and they chose to
          * put it in the nav.
          */}
        {CUSTOM_PAGES.filter((p) => p.nav !== false).map((p) => (<li key={p.slug}><Link to="/p/$slug" params={{ slug: p.slug }} className={t.listHover}>{p.title}</Link></li>))}
      </ul>
      {INFO_PAGES.length > 0 && (
        <>
          <h4 className={`text-sm font-semibold mt-6 mb-4 ${t.heading}`}>{tr('footer.guides')}</h4>
          <ul className={`space-y-2 text-sm ${t.listText}`}>
            {INFO_PAGES.map((i) => (<li key={i.slug}><Link to="/info/$slug" params={{ slug: i.slug }} className={t.listHover}>{i.name}</Link></li>))}
          </ul>
        </>
      )}
    </div>
  );
}
function ContactCol({ t }: { t: FooterTheme }) {
  const loc = locationLine();
  return (
    <div>
      <h4 className={`text-sm font-semibold mb-4 ${t.heading}`}>{tr('footer.getInTouch')}</h4>
      <ul className={`space-y-3 text-sm ${t.listText}`}>
        <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /><a href={`tel:${SITE.phone}`} className={t.listHover}>{SITE.phoneDisplay}</a></li>
        <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /><a href={`mailto:${SITE.email}`} className={`${t.listHover} break-all`}>{SITE.email}</a></li>
        {loc && <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /><span>{loc}</span></li>}
        {SITE.hours && <li className="flex items-start gap-2"><Clock className="h-4 w-4 mt-0.5 shrink-0" /><span>{SITE.hours}</span></li>}
      </ul>
    </div>
  );
}
function BottomBar({ t }: { t: FooterTheme }) {
  const year = new Date().getFullYear();
  return (
    <div className={`border-t ${t.border} relative`}>
      <div className={`container-x py-5 flex flex-wrap items-center justify-between gap-3 text-xs ${t.bottomText}`}>
        <div>© {year} {SITE.name}</div>
        <div className="flex gap-4">
          {/**
            * ⚠️ PRIVACY AND TERMS POINTED AT /contact ON EVERY GENERATED SITE. There is no privacy
            * route and no terms route in this template — the links went to a contact form. A
            * "Privacy" link that opens a contact form is worse than no link: it asserts a privacy
            * policy exists and sends a visitor looking for it into a dead end.
            * ★ So they render ONLY when the owner has actually made such a page (a custom page
            * whose slug says so). No page, no link — nothing is lost, and nothing is claimed.
            */}
          {LEGAL_PAGES.map((p) => (
            <Link key={p.slug} to="/p/$slug" params={{ slug: p.slug }} className={t.bottomHover}>{p.title}</Link>
          ))}
          <a href="/sitemap.xml" className={t.bottomHover}>{tr('footer.sitemap')}</a>
        </div>
      </div>
    </div>
  );
}
function LogoTagline({ t }: { t: FooterTheme }) {
  return (
    <div>
      <Logo src={SITE.logo_url} light={t.logoLight} height={48} alt={SITE.name} />
      {SITE.tagline && <p className={`mt-4 text-sm ${t.tagline} leading-relaxed font-display italic`}>{SITE.tagline}</p>}
      <div className="mt-5"><SocialRow t={t} /></div>
    </div>
  );
}

// ─── STRUCTURE 1 · COLUMNS (default / wow / corporate / clean / creative) — the classic 5-column grid. ──
function FooterColumns({ t, wow, decor }: { t: FooterTheme; wow: boolean; decor?: string }) {
  return (
    <>
      {wow && (<>
        <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-px" style={{ backgroundImage: "var(--wow-grad-brand)" }} />
        <div aria-hidden className="pointer-events-none absolute -top-1/4 right-0 h-2/3 w-1/2 opacity-25" style={{ backgroundImage: "var(--wow-grad-brand)", filter: "blur(90px)" }} />
      </>)}
      {decor && <img src={decor} alt="" aria-hidden className="absolute -left-16 top-0 h-full opacity-15 pointer-events-none select-none" />}
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 relative">
        <div className="lg:col-span-1"><LogoTagline t={t} /></div>
        <ServicesCol t={t} /><AreasCol t={t} /><CompanyCol t={t} /><ContactCol t={t} />
      </div>
      <BottomBar t={t} />
    </>
  );
}

// ─── STRUCTURE 2 · EDITORIAL (elegant) — a masthead rule + an ASYMMETRIC 12-column layout, small-caps
// labels, hairlines, generous air. Deliberately built to match the elegant HERO/SERVICES/REVIEWS rhythm
// (same designer), NOT centered. Ivory theme owns the neutrals; accent stays emerald/brand. ──
function FooterEditorial({ t }: { t: FooterTheme }) {
  const loc = locationLine();
  const capLabel = "text-[0.7rem] font-medium uppercase tracking-[0.24em]";
  return (
    <>
      <div className="container-x py-16 md:py-20">
        {/* Masthead: wordmark left, small-caps place/phone right, over a hairline. */}
        <div className={`flex flex-wrap items-end justify-between gap-6 border-b ${t.border} pb-8`}>
          <Logo src={SITE.logo_url} light={t.logoLight} height={52} alt={SITE.name} />
          <span className={`${capLabel} ${t.tagline}`}>{[loc, SITE.phoneDisplay].filter(Boolean).join("  ·  ")}</span>
        </div>

        {/* Asymmetric grid: tagline + social wide left; two small link columns right. */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {SITE.tagline && <p className={`max-w-md font-display text-xl italic leading-relaxed ${t.tagline}`}>{SITE.tagline}</p>}
            <div className="mt-6"><SocialRow t={t} /></div>
          </div>

          <nav className="lg:col-span-3">
            <h4 className={`${capLabel} mb-4 ${t.heading}`}>{tr('footer.company')}</h4>
            <ul className={`space-y-2.5 text-sm ${t.listText}`}>
              {SERVICES.slice(0, 4).map((s) => (<li key={s.slug}><Link to="/services/$slug" params={{ slug: s.slug }} className={`${t.listHover} transition-colors`}>{s.displayName}</Link></li>))}
              {!HIDDEN_NAV.includes('about') && <li><Link to="/about" className={t.listHover}>{tr('footer.about')}</Link></li>}
              {!HIDDEN_NAV.includes('reviews') && <li><Link to="/reviews" className={t.listHover}>{tr('footer.reviews')}</Link></li>}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h4 className={`${capLabel} mb-4 ${t.heading}`}>{tr('footer.getInTouch')}</h4>
            <ul className={`space-y-2.5 text-sm ${t.listText}`}>
              <li><a href={`tel:${SITE.phone}`} className={t.listHover}>{SITE.phoneDisplay}</a></li>
              <li><a href={`mailto:${SITE.email}`} className={`${t.listHover} break-all`}>{SITE.email}</a></li>
              {loc && <li>{loc}</li>}
              {SITE.hours && <li>{SITE.hours}</li>}
            </ul>
          </div>
        </div>
      </div>
      <BottomBar t={t} />
    </>
  );
}

// ─── STRUCTURE 3 · CTA BAND (bold / friendly) — a prominent get-in-touch band, then compact columns. ──
function FooterCtaBand({ t, ctaTitle, rounded }: { t: FooterTheme; ctaTitle: string; rounded: boolean }) {
  return (
    <>
      <div className="container-x pt-16">
        <div className={`flex flex-col items-start justify-between gap-6 ${rounded ? 'rounded-3xl' : 'rounded-xl'} border ${t.border} px-8 py-10 sm:flex-row sm:items-center`}>
          <div>
            <div className={`font-display text-2xl font-bold sm:text-3xl ${t.heading}`}>{ctaTitle}</div>
            <div className={`mt-2 text-sm ${t.tagline}`}>{SITE.phoneDisplay} · {SITE.email}</div>
          </div>
          <a href={`tel:${SITE.phone}`} className={`inline-flex h-12 items-center gap-2 ${rounded ? 'rounded-2xl' : 'rounded-lg'} bg-primary px-7 font-display text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5`}>
            {tr('cta.getInTouch')} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="container-x py-14 grid grid-cols-2 gap-8 md:grid-cols-4 relative">
        <div className="col-span-2 md:col-span-1"><LogoTagline t={t} /></div>
        <ServicesCol t={t} /><CompanyCol t={t} /><ContactCol t={t} />
      </div>
      <BottomBar t={t} />
    </>
  );
}

// ─── STRUCTURE 4 · MINIMAL (modern) — a tight two-row footer, mono labels, lots of negative space. ──
function FooterMinimal({ t }: { t: FooterTheme }) {
  const loc = locationLine();
  return (
    <>
      <div className="container-x py-14 relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Logo + tagline: the minimal footer still carries SITE.tagline (footer.tagline is an
              editor-editable field — dropping it silently no-op'd owner edits). Kept to one tight line. */}
          <div>
            <Logo src={SITE.logo_url} light={t.logoLight} height={40} alt={SITE.name} />
            {SITE.tagline && <p className={`mt-3 max-w-xs text-sm ${t.tagline} leading-relaxed font-display italic`}>{SITE.tagline}</p>}
          </div>
          <nav className={`flex flex-wrap gap-x-7 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em] ${t.listText}`}>
            {SERVICES.slice(0, 3).map((s) => (<Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className={`${t.listHover} transition-colors`}>{s.displayName}</Link>))}
            {!HIDDEN_NAV.includes('pricing') && <Link to="/pricing" className={t.listHover}>{tr('footer.pricing')}</Link>}
            {!HIDDEN_NAV.includes('reviews') && <Link to="/reviews" className={t.listHover}>{tr('footer.reviews')}</Link>}
            {!HIDDEN_NAV.includes('contact') && <Link to="/contact" className={t.listHover}>{tr('footer.contact')}</Link>}
          </nav>
          <SocialRow t={t} />
        </div>
        <div className={`mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm ${t.listText}`}>
          <a href={`tel:${SITE.phone}`} className={t.listHover}>{SITE.phoneDisplay}</a>
          <a href={`mailto:${SITE.email}`} className={t.listHover}>{SITE.email}</a>
          {loc && <span>{loc}</span>}
          {SITE.hours && <span>{SITE.hours}</span>}
        </div>
      </div>
      <BottomBar t={t} />
    </>
  );
}

// Resolve the footer variant: explicit prop (showcase) > SITE.footerVariant (family) > legacy chrome/character.
function resolveFooter(variantOverride?: string): { structure: FooterStructure; theme: string } {
  const explicit = variantOverride ?? (SITE as { footerVariant?: string }).footerVariant;
  if (explicit && FOOTER_VARIANTS[explicit]) return FOOTER_VARIANTS[explicit]!;
  const chrome = (SITE as { chromeStyle?: string }).chromeStyle ?? "";
  const character = (SITE as { character?: string }).character ?? "";
  const surface = (SITE as { surface?: string }).surface ?? "";
  if (chrome === "wow") return { structure: "columns", theme: "wow" };
  if (character === "elegant") return { structure: "editorial", theme: "elegant" };
  if (character && FOOTER_THEMES[character]) return { structure: "columns", theme: character };
  return { structure: "columns", theme: "default" }; // byte-identical default
}

export function Footer({ decorativeAsset = defaultLeaves, variant }: { decorativeAsset?: string; variant?: string } = {}) {
  const { structure, theme } = resolveFooter(variant);
  const t = FOOTER_THEMES[theme] ?? FOOTER_THEMES.default!;
  const isWow = theme === "wow";
  const showDecor = (SITE as { footerDecor?: string }).footerDecor !== "none" && structure === "columns" && !isWow;

  return (
    <footer className={`relative overflow-hidden ${t.surface}`}>
      {structure === "editorial" && <FooterEditorial t={t} />}
      {structure === "minimal" && <FooterMinimal t={t} />}
      {structure === "ctaBand" && <FooterCtaBand t={t} ctaTitle={tr('cta.readyWhenYouAre')} rounded={theme === "friendly"} />}
      {structure === "columns" && <FooterColumns t={t} wow={isWow} decor={showDecor ? decorativeAsset : undefined} />}
    </footer>
  );
}
