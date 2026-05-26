import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "~/lib/types/page-types";

interface Props {
  faqs: FAQ[];
  title?: string;
  intro?: string;
}

export function FAQSection({ faqs, title = "Frequently asked questions", intro }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  if (faqs.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="container-x py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-ink-900">{title}</h2>
          {intro && (
            <p className="mt-4 text-lg leading-relaxed text-ink-700">{intro}</p>
          )}
          <div className="mt-10 divide-y divide-ink-100 border-y border-ink-100">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full text-left py-5 flex items-start justify-between gap-4 focus-ring rounded-md"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base md:text-lg font-semibold text-ink-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-ink-500 shrink-0 mt-1 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pb-5 pr-8 text-ink-700 leading-relaxed">
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
