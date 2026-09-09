import { Phone, Sparkles } from "lucide-react";
import { tr } from '~/lib/i18n'
import { SITE } from "~/data/site";
import { PrimaryCta } from "~/components/blocks/PrimaryCta";
import { siteDecor } from "~/lib/decor";

import { HAS_PHONE } from '~/lib/phone'
interface Props {
  title?: string;
  subtitle?: string;
  to?: string;
  label?: string;
  decorativeAsset?: string;
  showSparkleBadge?: boolean;
}

export function CTASection({
  title = tr('cta.readyToStart'),
  subtitle,
  to = "/contact",
  label = (SITE as { ctaLabel?: string }).ctaLabel ?? tr('cta.getFreeQuote'),
  decorativeAsset = siteDecor(),
  showSparkleBadge = true,
}: Props) {
  const words = title.split(" ");
  const lead = words.slice(0, -1).join(" ");
  const accent = words.slice(-1).join("");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-fam-on-dark">
      {decorativeAsset && <img src={decorativeAsset} alt="" aria-hidden className="absolute -left-12 top-6 h-[140%] opacity-25 pointer-events-none select-none" />}
      {decorativeAsset && <img src={decorativeAsset} alt="" aria-hidden className="absolute -right-12 -bottom-12 h-[140%] opacity-20 pointer-events-none select-none rotate-180" />}
      <div className="container-x py-section text-center relative">
        {showSparkleBadge && SITE.tagline && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fam-card/10 border border-fam-card/20 text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="h-3.5 w-3.5" /> {SITE.tagline}
          </div>
        )}
        <h2 className="text-fam-on-dark max-w-2xl mx-auto">
          {lead} <span className="font-script text-brand-200 font-normal">{accent}</span>
        </h2>
        {subtitle && (
          <p className="mt-5 text-fam-on-dark/85 text-lg max-w-xl mx-auto">{subtitle}</p>
        )}
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <PrimaryCta to={to} className="btn btn-lg btn-white">{label}</PrimaryCta>
          {HAS_PHONE && (<a href={`tel:${SITE.phone}`} className="btn btn-lg btn-outline-fam-card">
            <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
          </a>)}
        </div>
      </div>
    </section>
  );
}
