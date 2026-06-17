// Section-header VARIANT: elegant (dark-luxury). The elegant analog of
// SectionHeaderBold — a NEW component, not a generalization. Refined serif
// (font-display, set to a luxury serif by the DNA), title-case (NOT bold's
// uppercase-condensed), a letter-spaced small eyebrow with a thin amber rule
// (NOT the cursive script flourish, NOT a solid block). Designed for the warm-
// dark surfaces the elegant blocks own, so its text is warm cream / taupe.
//
// TOKEN DISCIPLINE: font-display (DNA serif); emerald-* (DNA accent) for the
// eyebrow rule + label; surface neutrals from elegantSurface() — LIGHT by default
// (warm charcoal text), DARK on opt-in (cream/taupe, byte-identical to before).
// No font-script, no bg-brand-*, no .btn. Same Props shape as the other section
// headers (drop-in).
import { elegantSurface } from "~/lib/elegant-surface";

interface Props {
  label?: string;
  heading: string;
  scriptAccent?: string;
  body?: string;
  align?: "center" | "left";
}

export function SectionHeaderElegant({
  label,
  heading,
  scriptAccent,
  body,
  align = "left",
}: Props) {
  const s = elegantSurface();
  const alignClass =
    align === "center" ? "items-center text-center mx-auto max-w-2xl" : "max-w-2xl";
  // Fold the accent word into the solid serif heading (no cursive flourish).
  const fullHeading = scriptAccent ? `${heading} ${scriptAccent}` : heading;

  return (
    <div className={`flex flex-col ${alignClass} mb-12`}>
      {label && (
        <span
          className={`inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-emerald-600 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-8 bg-emerald-600" />
          {label}
        </span>
      )}
      <h2 className={`mt-5 font-display text-4xl font-medium leading-[1.1] tracking-tight ${s.text} sm:text-5xl`}>
        {fullHeading}
      </h2>
      {body && (
        <p className={`mt-4 max-w-xl text-lg leading-relaxed ${s.muted}`}>{body}</p>
      )}
    </div>
  );
}
