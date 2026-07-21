import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, MapPin, Phone, Star } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { FAQSection } from "./FAQSection";
import { CTASection } from "./CTASection";
import { SectionHeader } from "./SectionHeader";
import { renderCharacterHero, renderCharacterCta } from "./CharacterHero";
import { serviceImageUrl } from "~/data/images";
import { SITE } from "~/data/site";
import leaves from "~/assets/decorative/cleaning-leaves.png";
import type { ServicePageData } from "~/lib/types/page-types";

interface Props {
  data: ServicePageData;
}

function splitScriptAccent(heading: string): { lead: string; accent: string } {
  const words = heading.trim().split(/\s+/);
  if (words.length < 2) return { lead: "", accent: heading };
  return { lead: words.slice(0, -1).join(" "), accent: words.slice(-1).join("") };
}

export function ServicePageTemplate({ data }: Props) {
  const h1Parts = splitScriptAccent(data.hero.h1);
  const localTitle = data.localContext?.title;
  const localTitleParts = localTitle ? splitScriptAccent(localTitle) : null;

  // Character hero/CTA (generic vertical only). Per-page content: this service's
  // OWN title + OWN image (NOT the homepage's). subheadline="" suppresses the
  // homepage subheadline on the inner page. null for known verticals → bespoke.
  const characterHero = renderCharacterHero({
    headline: data.hero.h1,
    body: data.hero.subhead,
    imageUrl: serviceImageUrl(data.slug),
    subheadline: "",
  });
  const characterCta = renderCharacterCta({
    title: "Ready when you are.",
    subtitle: "Get a free quote and we'll be in touch within a business day.",
  });

  return (
    <>
      {/* HERO — character variant (generic vertical) rendering THIS service's own
          title + own image, else the bespoke service hero (known verticals, byte-
          identical). Breadcrumbs relocate ABOVE the character hero (it has no
          breadcrumb slot) so the nav/SEO hierarchy stays in the SSR'd DOM;
          data.hero.trustLine renders just below it so it stays visible. */}
      {characterHero ? (
        <>
          <nav aria-label="Breadcrumb" className="container-x pt-8 md:pt-10">
            <Breadcrumbs items={[
              { label: "Home", to: "/" },
              { label: "Services", to: "/services" },
              { label: data.title },
            ]} />
          </nav>
          {characterHero}
          {data.hero.trustLine && (
            <div className="container-x">
              <p className="py-4 text-sm text-ink-500">{data.hero.trustLine}</p>
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
            { label: "Services", to: "/services" },
            { label: data.title },
          ]} />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h1 className="mt-4">
                {h1Parts.lead}
                {h1Parts.lead && " "}
                <span className="font-script text-brand-600">{h1Parts.accent}</span>
              </h1>
              <p className="mt-5 text-lg text-ink-700 max-w-xl leading-relaxed">
                {data.hero.subhead}
              </p>
              {data.hero.trustLine && (
                <p className="mt-3 text-sm text-ink-500">{data.hero.trustLine}</p>
              )}
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
                  src={serviceImageUrl(data.slug)}
                  alt={data.hero.h1}
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

      {/* WHAT WE COVER — omit when the section has no items */}
      {data.whatWeBuy.items.length > 0 && (
      <section className="bg-white">
        <div className="container-x py-16 md:py-24">
          <div className="max-w-3xl">
            <h2>{data.whatWeBuy.title}</h2>
            <p className="mt-4 text-lg text-ink-700 leading-relaxed">{data.whatWeBuy.body}</p>
          </div>
          {data.whatWeBuy.items.length > 0 && (
            <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.whatWeBuy.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-ink-700">
                  <Check className="h-5 w-5 text-brand-600 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      )}

      {/* HOW PRICING WORKS — omit when there are no pricing factors */}
      {data.howPrice.factors.length > 0 && (
      <section className="bg-brand-50 border-y border-brand-100">
        <div className="container-x py-16 md:py-24">
          <SectionHeader
            label="Pricing factors"
            heading={data.howPrice.title}
            body={data.howPrice.body}
            align="left"
          />
          {data.howPrice.factors.length > 0 && (
            <ul className="mt-4 space-y-6">
              {data.howPrice.factors.map((f, i) => (
                <li key={i} className="flex gap-5">
                  <span className="shrink-0 font-display text-3xl text-brand-200 w-12">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-lg">{f.title}</h3>
                    <p className="mt-1 text-ink-700 leading-relaxed">{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      )}

      {/* SCENARIOS / PERFECT FOR — omit when there are no scenario cards */}
      {data.scenarios.cards.length > 0 && (
      <section className="bg-white">
        <div className="container-x py-16 md:py-24">
          <SectionHeader heading={data.scenarios.title} body={data.scenarios.intro} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.scenarios.cards.map((c, i) => (
              <div key={i} className="card-stead p-6">
                <h4>{c.title}</h4>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* PRICING DETAIL — omit when there are no ranges or notes */}
      {(data.pricing.notes.length > 0 ||
        (data.pricing.ranges?.length ?? 0) > 0) && (
      <section className="bg-brand-50 border-y border-brand-100">
        <div className="container-x py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2>{data.pricing.title}</h2>
            <p className="mt-4 text-lg text-ink-700 leading-relaxed">{data.pricing.body}</p>
          </div>
          {data.pricing.ranges && data.pricing.ranges.length > 0 && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {data.pricing.ranges.map((r) => (
                <div key={r.label} className="card-stead p-6 text-center">
                  <p className="text-xs uppercase tracking-wider text-ink-500">{r.label}</p>
                  <p className="mt-2 font-display text-3xl text-brand-700">{r.range}</p>
                </div>
              ))}
            </div>
          )}
          {data.pricing.notes.length > 0 && (
            <ul className="mt-10 max-w-2xl mx-auto space-y-2 border-t border-brand-200 pt-6">
              {data.pricing.notes.map((n, i) => (
                <li key={i} className="text-ink-700 leading-relaxed flex items-start gap-3">
                  <span aria-hidden className="text-brand-600 shrink-0">—</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      )}

      {/* LOCAL CONTEXT (optional) */}
      {data.localContext && (
        <section className="bg-white">
          <div className="container-x py-16">
            <div className="card-soft p-8 md:p-10 max-w-3xl mx-auto">
              <span className="badge-pill bg-white border border-brand-100 text-brand-600">Local insight</span>
              <h2 className="mt-3">
                {localTitleParts ? (
                  <>
                    {localTitleParts.lead}
                    {localTitleParts.lead && " "}
                    <span className="font-script text-brand-600">{localTitleParts.accent}</span>
                  </>
                ) : (
                  <>Built for <span className="font-script text-brand-600">{SITE.address.city || "you"}</span></>
                )}
              </h2>
              <div className="mt-5 space-y-4">
                {data.localContext.body.map((p, i) => (
                  <p key={i} className="text-lg text-ink-700 leading-relaxed">{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* COVERAGE AREAS */}
      {data.coverage.areas.length > 0 && (
        <section className="bg-white">
          <div className="container-x py-16 md:py-24">
            <SectionHeader heading={data.coverage.title} body={data.coverage.intro} />
            <div className="flex flex-wrap justify-center gap-2">
              {data.coverage.areas.map((a) => (
                <Link
                  key={a.href}
                  to={a.href}
                  className="badge-pill bg-white border border-ink-100 text-ink-700 hover:border-brand-600 hover:text-brand-600 normal-case tracking-normal text-sm"
                >
                  <MapPin className="h-3.5 w-3.5" /> {a.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIAL (optional) */}
      {data.testimonial && (
        <section className="bg-brand-50 border-y border-brand-100">
          <div className="container-x py-16">
            <figure className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center gap-0.5 mb-4">
                {Array.from({ length: data.testimonial.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="font-display text-2xl md:text-3xl text-ink-900 leading-snug">
                "{data.testimonial.text}"
              </blockquote>
              <figcaption className="mt-6 text-ink-700">
                <span className="font-semibold">{data.testimonial.author}</span>
                {data.testimonial.location && (
                  <span className="text-ink-500"> · {data.testimonial.location}</span>
                )}
              </figcaption>
            </figure>
          </div>
        </section>
      )}

      {/* FAQ */}
      <FAQSection faqs={data.faqs} title="Questions we hear often" />

      {/* RELATED SERVICES */}
      {data.relatedServices.length > 0 && (
        <section className="bg-brand-50 border-y border-brand-100">
          <div className="container-x py-16 md:py-24">
            <SectionHeader heading="You may also need" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {data.relatedServices.map((r) => (
                <Link
                  key={r.href}
                  to={r.href}
                  className="card-stead p-7 group hover:shadow-lg transition-all"
                >
                  <h4>{r.label}</h4>
                  <div className="mt-3 text-brand-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {characterCta ?? (
        <CTASection
          title="Ready when you are."
          subtitle="Get a free quote and we'll be in touch within a business day."
        />
      )}
    </>
  );
}
