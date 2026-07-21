import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { resolveCharacterTokens } from "~/lib/character-tokens";
import type { FAQ } from "~/lib/types/page-types";

interface Props {
  faqs: FAQ[];
  title?: string;
  intro?: string;
}

export function FAQSection({ faqs, title = "Frequently asked questions", intro }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  if (faqs.length === 0) return null;

  // Character tokens (see character-tokens.ts). null → known verticals keep the
  // literals below verbatim (byte-identical — this is a SHARED component). For
  // character sites the divide-color would be a runtime-built arbitrary class that
  // Tailwind never scans, so separators switch to per-item border-t (the border
  // token IS a literal in the map → scanned).
  const T = resolveCharacterTokens();
  const secPlain = T?.section ?? "bg-white";
  const tStrong = T?.text ?? "text-ink-900";
  const tBody = T?.text ?? "text-ink-700";
  const tMuted = T?.muted ?? "text-ink-500";
  const faqWrap = T ? `mt-10 border-y ${T.border}` : "mt-10 divide-y divide-ink-100 border-y border-ink-100";

  return (
    <section className={secPlain}>
      <div className="container-x py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className={tStrong}>{title}</h2>
          {intro && (
            <p className={`mt-4 text-lg leading-relaxed ${tBody}`}>{intro}</p>
          )}
          <div className={faqWrap}>
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className={T && i > 0 ? `border-t ${T.border}` : undefined}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full text-left py-5 flex items-start justify-between gap-4 focus-ring rounded-md"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-base md:text-lg font-semibold ${tStrong}`}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 ${tMuted} shrink-0 mt-1 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className={`pb-5 pr-8 ${tBody} leading-relaxed`}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
