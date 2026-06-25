// Section-header VARIANT: friendly (warm + bright). The friendly analog of
// SectionHeaderBold / SectionHeaderElegant — a NEW component. Rounded friendly
// sans (font-display, set to Quicksand by the DNA), title-case, a warm coral
// eyebrow with a soft rounded dot (NOT a script flourish, NOT an uppercase rule).
// Designed for the LIGHT-warm surfaces the friendly blocks own, so its text is
// warm charcoal / warm gray.
//
// TOKEN DISCIPLINE: font-display (DNA rounded sans); emerald-* (DNA accent →
// coral) for the eyebrow dot + label; light-warm neutrals hardcoded (charcoal
// #3D3530, gray #7A6F66) — contained to the friendly components. No font-script,
// no bg-brand-*, no .btn. Same Props shape as the other section headers (drop-in).
interface Props {
  label?: string;
  heading: string;
  scriptAccent?: string;
  body?: string;
  align?: "center" | "left";
}

export function SectionHeaderFriendly({
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
    <div className={`flex flex-col ${alignClass} mb-12`}>
      {label && (
        <span
          className={`inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
          {label}
        </span>
      )}
      <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-[#3D3530] sm:text-5xl">
        {fullHeading}
      </h2>
      {body && (
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#7A6F66]">{body}</p>
      )}
    </div>
  );
}
