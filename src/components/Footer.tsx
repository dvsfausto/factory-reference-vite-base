import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Logo } from "./Logo";
import { SITE } from "~/data/site";
import { SERVICES } from "~/data/services";
import { AREAS } from "~/data/areas";
import { INFO_PAGES } from "~/data/info-pages";
import defaultLeaves from "~/assets/decorative/cleaning-leaves.png";

interface FooterProps {
  decorativeAsset?: string;
}

export function Footer({ decorativeAsset = defaultLeaves }: FooterProps = {}) {
  const year = new Date().getFullYear();
  const locationLine = [SITE.address.city, SITE.address.state]
    .filter(Boolean)
    .join(", ");

  return (
    <footer className="relative overflow-hidden bg-brand-900 text-white">
      <img src={decorativeAsset} alt="" aria-hidden className="absolute -left-16 top-0 h-full opacity-15 pointer-events-none select-none" />
      <div className="container-x py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 relative">
        <div className="lg:col-span-1">
          <Logo light height={48} alt={SITE.name} />
          {SITE.tagline && (
            <p className="mt-4 text-sm text-white/70 leading-relaxed font-display italic">
              {SITE.tagline}
            </p>
          )}
          <div className="flex gap-3 mt-5">
            {SITE.social.instagram && (
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 focus-ring">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {SITE.social.facebook && (
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 focus-ring">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {SITE.social.yelp && (
              <a href={SITE.social.yelp} target="_blank" rel="noopener noreferrer" aria-label="Yelp" className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 focus-ring text-xs font-bold">Y</a>
            )}
            {SITE.social.google && (
              <a href={SITE.social.google} target="_blank" rel="noopener noreferrer" aria-label="Google" className="h-9 w-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 focus-ring text-xs font-bold">G</a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4 font-sans-body uppercase tracking-wider">Services</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-white">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4 font-sans-body uppercase tracking-wider">Service Areas</h4>
          <ul className="space-y-2 text-sm text-white/70">
            {AREAS.map((a) => (
              <li key={a.slug}>
                <Link to="/areas/$slug" params={{ slug: a.slug }} className="hover:text-white">
                  {a.name}
                </Link>
              </li>
            ))}
            <li><Link to="/areas" className="text-brand-200 hover:text-white">View all areas →</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4 font-sans-body uppercase tracking-wider">Company</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link to="/reviews" className="hover:text-white">Reviews</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            {INFO_PAGES.map((i) => (
              <li key={i.slug}>
                <Link to="/info/$slug" params={{ slug: i.slug }} className="hover:text-white">
                  {i.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-4 font-sans-body uppercase tracking-wider">Get in touch</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 shrink-0" /><a href={`tel:${SITE.phone}`} className="hover:text-white">{SITE.phoneDisplay}</a></li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 shrink-0" /><a href={`mailto:${SITE.email}`} className="hover:text-white break-all">{SITE.email}</a></li>
            {locationLine && (
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /><span>{locationLine}</span></li>
            )}
            {SITE.hours && (
              <li className="flex items-start gap-2"><Clock className="h-4 w-4 mt-0.5 shrink-0" /><span>{SITE.hours}</span></li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 relative">
        <div className="container-x py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
          <div>© {year} {SITE.name}</div>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-white">Privacy</Link>
            <Link to="/contact" className="hover:text-white">Terms</Link>
            <a href="/sitemap.xml" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
