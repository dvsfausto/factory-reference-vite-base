import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, Phone } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { FAQSection } from "./FAQSection";
import { CTASection } from "./CTASection";
import { SectionHeader } from "./SectionHeader";
import { renderCharacterHero, renderCharacterCta } from "./CharacterHero";
import { resolveCharacterTokens } from "~/lib/character-tokens";
import { ReviewCard } from "./ReviewCard";
import { areaImageUrl, areaAlt, serviceImageUrl } from "~/data/images";
import { SERVICES } from "~/data/services";
import { reviews } from "~/data/reviews";
import { SITE } from "~/data/site";
import leaves from "~/assets/decorative/cleaning-leaves.png";
import type { ServiceAreaPageData } from "~/lib/types/page-types";

interface Props {
  data: ServiceAreaPageData;
}

function splitScriptAccent(heading: string): { lead: string; accent: string } {
  const words = heading.trim().split(/\s+/);
  if (words.length < 2) return { lead: "", accent: heading };
  return { lead: words.slice(0, -1).join(" "), accent: words.slice(-1).join("") };
}

export function ServiceAreaPageTemplate({ data }: Props) {
  const h1Parts = splitScriptAccent(data.hero.h1);
  const localTitle = data.localContext?.title;
  const localTitleParts = localTitle ? splitScriptAccent(localTitle) : null;

  const servicesMap = new Map(SERVICES.map((s) => [s.slug, s]));
  const featured = data.servicesHere.featured
    .map((slug) => servicesMap.get(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const matchingReviews = reviews.filter((r) => r.location === data.name);
  const displayReviews = matchingReviews.length >= 3
    ? matchingReviews.slice(0, 3)
    : reviews.slice(0, 3);

  // Character hero/CTA (generic vertical only). Per-page content: this area's OWN
  // name + OWN image. subheadline="" suppresses the homepage subheadline. null for
  // known verticals → bespoke area hero (byte-identical).
  const characterHero = renderCharacterHero({
    headline: data.hero.h1,
    body: data.hero.subhead,
    imageUrl: areaImageUrl(data.slug),
    subheadline: "",
  });
  const characterCta = renderCharacterCta({
    title: `Working in ${data.name}?`,
    subtitle: "We'll respond within a business day with a free quote.",
  });

  // Character tokens for the shared middle sections (see character-tokens.ts). null →
  // known verticals keep the literals below (byte-identical). brand accents (text-brand-*)
  // stay per operator decision.
  const T = resolveCharacterTokens();
  const secPlain = T?.section ?? "bg-white";
  const secBand = T ? `${T.sectionAlt} border-y ${T.border}` : "bg-brand-50 border-y border-brand-100";
  const tPad = T?.spacingY ?? "py-16 md:py-24";
  const tBody = T?.text ?? "text-ink-700";
  const tMuted = T?.muted ?? "text-ink-500";
  const Header = T?.SectionHeader ?? SectionHeader;
  const hCls = T ? `${T.text} ${T.headingCase}`.trim() : undefined;
  const tCard = T ? `${T.card} ${T.cardRadius} border ${T.border} ${T.cardElevation}` : "card-stead";

  return (
    <>
      {/* HERO — character variant (generic vertical) rendering THIS area's own name
          + own image, else the bespoke area hero (known verticals, byte-identical).
          Breadcrumbs relocate ABOVE the character hero (SSR/SEO); the zipCodes badge
          relocates just below it so it stays visible. */}
      {characterHero ? (
        <>
          <nav aria-label="Breadcrumb" className="container-x pt-8 md:pt-10">
            <Breadcrumbs items={[
              { label: "Home", to: "/" },
              { label: "Areas", to: "/areas" },
              { label: data.name },
            ]} />
          </nav>
          {characterHero}
          {data.zipCodes && data.zipCodes.length > 0 && (
            <div className="container-x">
              <span className="badge-pill bg-white border border-brand-100 text-brand-600">
                <MapPin className="h-3.5 w-3.5" /> {data.zipCodes.join(" · ")}
              </span>
            </div>
          )}
        </>
      ) : (
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <img src={leaves} alt="" aria-hidden className="hidden md:block absolute -left-10 top-10 h-[80%] opacity-50 pointer-events-none select-none" />
        <img src={leaves} alt="" aria-hidden className="hidden md:block absolute -right-10 bottom-0 h-[60%] opacity-40 pointer-events-none select-none rotate-180" />
        <div className="container-x py-12 md:py-16 relative">
          <Breadcrumbs items={[
            { label: "Home", to: "/" },
            { label: "Areas", to: "/areas" },
            { label: data.name },
          ]} />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              {data.zipCodes && data.zipCodes.length > 0 && (
                <span className="badge-pill bg-white border border-brand-100 text-brand-600">
                  <MapPin className="h-3.5 w-3.5" /> {data.zipCodes.join(" · ")}
                </span>
              )}
              <h1 className="mt-4">
                {h1Parts.lead}
                {h1Parts.lead && " "}
                <span className="font-script text-brand-600">{h1Parts.accent}</span>
              </h1>
              <p className="mt-5 text-lg text-ink-700 max-w-xl leading-relaxed">
                {data.hero.subhead}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/contact" className="btn btn-lg btn-primary">
                  Get Free Quote <ArrowRight className="h-4 w-4" />
                </Link>
                <a href={`tel:${SITE.phone}`} className="btn btn-lg btn-secondary">
                  <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="aspect-[4/3] rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-brand-50">
                <img
                  src={areaImageUrl(data.slug)}
                  alt={areaAlt(data.slug)}
                  width={1200}
                  height={900}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* AT A GLANCE / ABOUT — omit when there's no about body */}
      {data.about.body.length > 0 && (
      <section className={secPlain}>
        <div className={`container-x ${T ? T.spacingY.split(" ")[0] : "py-16"}`}>
          <div className={`${T ? `${T.card} ${T.cardRadius} border ${T.border}` : "card-soft"} p-8 max-w-3xl mx-auto`}>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              {data.name} at a glance
            </span>
            <h2 className={`mt-3 text-2xl ${T ? T.text : ""}`.trimEnd()}>{data.about.title}</h2>
            <div className="mt-4 space-y-3">
              {data.about.body.map((p, i) => (
                <p key={i} className={`${tBody} leading-relaxed`}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* SERVICES HERE */}
      {featured.length > 0 && (
        <section className={secBand}>
          <div className={`container-x ${tPad}`}>
            <Header
              label="Services available"
              heading={data.servicesHere.title}
              body={data.servicesHere.intro}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((s) => (
                <Link
                  key={s.slug}
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className={T ? `${T.card} ${T.cardRadius} border ${T.border} overflow-hidden group ${T.cardElevation}` : "card-stead overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all"}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={serviceImageUrl(s.slug)}
                      alt={s.name}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className={hCls}>{s.name}</h4>
                    <p className={`mt-2 text-sm ${tMuted}`}>{s.short}</p>
                    <div className="mt-3 text-brand-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LANDMARKS / SUB-AREAS */}
      {data.landmarks.items.length > 0 && (
        <section className={secPlain}>
          <div className={`container-x ${tPad}`}>
            <Header
              heading={data.landmarks.title}
              body={data.landmarks.intro}
              align="left"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.landmarks.items.map((item, i) => (
                <div key={i} className={`flex items-start gap-2 ${tBody}`}>
                  <Check className="h-4 w-4 text-brand-600 mt-1 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LOCAL CONTEXT (optional) */}
      {data.localContext && (
        <section className={secBand}>
          <div className={`container-x ${T ? T.spacingY.split(" ")[0] : "py-16"}`}>
            <div className={T ? `${T.card} ${T.cardRadius} border ${T.border} p-8 md:p-10 max-w-3xl mx-auto` : "card-soft p-8 md:p-10 max-w-3xl mx-auto bg-white"}>
              <span className="badge-pill bg-brand-50 text-brand-600">Local insight</span>
              <h2 className={`mt-3 ${T ? T.text : ""}`.trimEnd()}>
                {localTitleParts ? (
                  <>
                    {localTitleParts.lead}
                    {localTitleParts.lead && " "}
                    <span className="font-script text-brand-600">{localTitleParts.accent}</span>
                  </>
                ) : (
                  <>Why {data.name} chooses <span className="font-script text-brand-600">us</span></>
                )}
              </h2>
              <div className="mt-5 space-y-4">
                {data.localContext.body.map((p, i) => (
                  <p key={i} className={`text-lg ${tBody} leading-relaxed`}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* REVIEWS (filtered to area) */}
      {displayReviews.length > 0 && (
        <section className={secPlain}>
          <div className={`container-x ${tPad}`}>
            <Header
              label="Reviews"
              heading={`${data.name} customer stories`}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {displayReviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <FAQSection faqs={data.faqs} title={`Questions about ${data.name}`} />

      {/* RELATED AREAS */}
      {data.relatedAreas.length > 0 && (
        <section className={secBand}>
          <div className={`container-x ${T ? T.spacingY.split(" ")[0] : "py-16"}`}>
            <Header heading="We also serve nearby" />
            <div className="flex flex-wrap justify-center gap-3">
              {data.relatedAreas.map((a) => (
                <Link
                  key={a.href}
                  to={a.href}
                  className={T ? `${T.card} ${T.cardRadius} border ${T.border} px-5 py-3 ${T.text} transition-colors` : "card-stead px-5 py-3 hover:border-brand-600 transition-colors"}
                >
                  <span className={T ? "font-semibold" : "font-semibold text-ink-900"}>{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {characterCta ?? (
        <CTASection
          title={`Working in ${data.name}?`}
          subtitle="We'll respond within a business day with a free quote."
        />
      )}
    </>
  );
}
