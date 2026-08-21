import { Link } from "@tanstack/react-router";
import { tr } from '~/lib/i18n'
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "./Breadcrumbs";
import { FAQSection } from "./FAQSection";
import { CTASection } from "./CTASection";
import { SectionHeader } from "./SectionHeader";
import { isRelatedServiceVisible } from "~/data/services-view";
import { pageImageUrl, hasPageImage } from "~/data/images";
import leaves from "~/assets/decorative/cleaning-leaves.png";
import type { InfoPageData } from "~/lib/types/page-types";

interface Props {
  data: InfoPageData;
}

function splitScriptAccent(heading: string): { lead: string; accent: string } {
  const words = heading.trim().split(/\s+/);
  if (words.length < 2) return { lead: "", accent: heading };
  return { lead: words.slice(0, -1).join(" "), accent: words.slice(-1).join("") };
}

export function InfoPageTemplate({ data }: Props) {
  const h1Parts = splitScriptAccent(data.hero.h1);
  // Drop related-service links to unpublished services (self-heals; identical when none unpublished).
  const relatedServices = data.relatedServices.filter((r) => isRelatedServiceVisible(r.href));
  // Editorial banner — a distinct pool image (industry-anchored) for this content page. Rendered ONLY when
  // it is genuinely different from the hero, so thin builds (no editorial/service pool) stay text-forward
  // and unchanged; rich builds get a page image that never repeats the hero.
  const bannerSrc = hasPageImage(data.slug) ? pageImageUrl(data.slug) : null;

  return (
    <>
      {/* HERO — simple single column */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <img src={leaves} alt="" aria-hidden className="hidden md:block absolute -right-10 top-0 h-[60%] opacity-30 pointer-events-none select-none rotate-180" />
        <div className="container-x py-12 md:py-16 relative">
          <div className="max-w-3xl">
            <Breadcrumbs items={[
              { label: tr('breadcrumb.home'), to: "/" },
              { label: data.title },
            ]} />
            <h1 className="mt-6">
              {h1Parts.lead}
              {h1Parts.lead && " "}
              <span className="font-script text-brand-600">{h1Parts.accent}</span>
            </h1>
            <p className="mt-5 text-lg text-ink-700 leading-relaxed">
              {data.hero.subhead}
            </p>
            {bannerSrc && (
              <img
                src={bannerSrc}
                alt=""
                aria-hidden
                loading="lazy"
                className="mt-8 aspect-[16/7] w-full rounded-2xl object-cover shadow-sm"
              />
            )}
          </div>
        </div>
      </section>

      {/* ARTICLE BODY */}
      <article className="bg-white">
        <div className="container-x py-16">
          <div className="max-w-3xl mx-auto">
            {data.intro.length > 0 && (
              <div className="space-y-4">
                {data.intro.map((p, i) => (
                  <p key={i} className="text-lg text-ink-700 leading-relaxed">{p}</p>
                ))}
              </div>
            )}
            {data.sections.length > 0 && (
              <div className="mt-12 space-y-12">
                {data.sections.map((s, i) => (
                  <section key={i}>
                    <h2 className="text-2xl md:text-3xl">{s.heading}</h2>
                    <div className="mt-4 space-y-4">
                      {s.body.map((p, bi) => (
                        <p key={bi} className="text-ink-700 leading-relaxed">{p}</p>
                      ))}
                    </div>
                    {s.list && s.list.length > 0 && (
                      <ul className="mt-6 space-y-2">
                        {s.list.map((l, li) => (
                          <li key={li} className="flex items-start gap-3 text-ink-700 leading-relaxed">
                            <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" />
                            <span>{l}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* RELATED */}
      {(relatedServices.length > 0 || data.relatedInfo.length > 0) && (
        <section className="bg-brand-50 border-y border-brand-100">
          <div className="container-x py-16">
            <SectionHeader heading={tr('tmpl.relatedReading')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              {relatedServices.length > 0 && (
                <div>
                  <p className="badge-pill bg-white border border-brand-100 text-brand-600">{tr('related.relatedServices')}</p>
                  <ul className="mt-4 space-y-3">
                    {relatedServices.map((r) => (
                      <li key={r.href}>
                        <Link
                          to={r.href}
                          className="group flex items-center gap-2 text-base font-semibold text-ink-900 hover:text-brand-600"
                        >
                          {r.label}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.relatedInfo.length > 0 && (
                <div>
                  <p className="badge-pill bg-white border border-brand-100 text-brand-600">{tr('common.readMore')}</p>
                  <ul className="mt-4 space-y-3">
                    {data.relatedInfo.map((r) => (
                      <li key={r.href}>
                        <Link
                          to={r.href}
                          className="group flex items-center gap-2 text-base font-semibold text-ink-900 hover:text-brand-600"
                        >
                          {r.label}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <FAQSection faqs={data.faqs} title={tr('tmpl.moreQuestions')} />

      <CTASection title={tr('cta.readyWhenYouAre')} />
    </>
  );
}
