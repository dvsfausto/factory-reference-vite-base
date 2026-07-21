import { Link } from "@tanstack/react-router";
import { Phone, Sparkles } from "lucide-react";
import { SITE } from "~/data/site";
import defaultLeaves from "~/assets/decorative/cleaning-leaves.png";

interface Props {
  title?: string;
  subtitle?: string;
  to?: string;
  label?: string;
  decorativeAsset?: string;
  showSparkleBadge?: boolean;
}

export function CTASection({
  title = "Ready to get started?",
  subtitle,
  to = "/contact",
  label = (SITE as { ctaLabel?: string }).ctaLabel ?? "Get Free Quote",
  decorativeAsset = defaultLeaves,
  showSparkleBadge = true,
}: Props) {
  const words = title.split(" ");
  const lead = words.slice(0, -1).join(" ");
  const accent = words.slice(-1).join("");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white">
      <img src={decorativeAsset} alt="" aria-hidden className="absolute -left-12 top-6 h-[140%] opacity-25 pointer-events-none select-none" />
      <img src={decorativeAsset} alt="" aria-hidden className="absolute -right-12 -bottom-12 h-[140%] opacity-20 pointer-events-none select-none rotate-180" />
      <div className="container-x py-20 md:py-24 text-center relative">
        {showSparkleBadge && SITE.tagline && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="h-3.5 w-3.5" /> {SITE.tagline}
          </div>
        )}
        <h2 className="text-white max-w-2xl mx-auto">
          {lead} <span className="font-script text-brand-200 font-normal">{accent}</span>
        </h2>
        {subtitle && (
          <p className="mt-5 text-white/85 text-lg max-w-xl mx-auto">{subtitle}</p>
        )}
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to={to} className="btn btn-lg btn-white">{label}</Link>
          <a href={`tel:${SITE.phone}`} className="btn btn-lg btn-outline-white">
            <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
