// Section-header VARIANT: corporate (formal + authoritative). A NEW component.
// Sturdy grotesque (font-display, set to Libre Franklin by the DNA), heavy
// weight, tight tracking, a structured navy eyebrow (a short navy rule + a
// wide-tracked uppercase label — no diamond, no script). Dense, institutional.
//
// TOKEN DISCIPLINE: font-display (DNA sans); emerald-* (DNA accent → navy) for
// the eyebrow; structured neutrals hardcoded (navy-charcoal #1A2433 / #5A6678) —
// contained to the corporate components. No font-script, no bg-brand-*, no .btn.
// Same Props shape as the other section headers (drop-in).
interface Props {
  label?: string;
  heading: string;
  scriptAccent?: string;
  body?: string;
  align?: "center" | "left";
}

export function SectionHeaderCorporate({
  label,
  heading,
  scriptAccent,
  body,
  align = "left",
}: Props) {
  const alignClass =
    align === "center" ? "items-center text-center mx-auto max-w-2xl" : "max-w-2xl";
  const fullHeading = scriptAccent ? `${heading} ${scriptAccent}` : heading;

  return (
    <div className={`flex flex-col ${alignClass} mb-10`}>
      {label && (
        <span
          className={`inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-600 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="h-0.5 w-7 bg-emerald-600" />
          {label}
        </span>
      )}
      <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-[#1A2433] sm:text-4xl">
        {fullHeading}
      </h2>
      {body && (
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#5A6678]">{body}</p>
      )}
    </div>
  );
}
