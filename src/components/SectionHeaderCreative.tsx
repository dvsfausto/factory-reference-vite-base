// Section-header VARIANT: creative (expressive + color-forward). A NEW component.
// Expressive display type (font-display, set to Syne by the DNA), oversized and
// confident, with a magenta accent block — bold, design-led, asymmetric-leaning.
//
// TOKEN DISCIPLINE: font-display (DNA display); emerald-* (DNA accent → magenta)
// for the eyebrow block; expressive neutrals hardcoded (ink #18181B / #71717A) —
// contained to the creative components. No font-script, no bg-brand-*, no .btn.
// Same Props shape as the other section headers (drop-in).
interface Props {
  label?: string;
  heading: string;
  scriptAccent?: string;
  body?: string;
  align?: "center" | "left";
}

export function SectionHeaderCreative({
  label,
  heading,
  scriptAccent,
  body,
  align = "left",
}: Props) {
  const alignClass =
    align === "center" ? "items-center text-center mx-auto max-w-3xl" : "max-w-3xl";
  const fullHeading = scriptAccent ? `${heading} ${scriptAccent}` : heading;

  return (
    <div className={`flex flex-col ${alignClass} mb-12`}>
      {label && (
        <span
          className={`inline-flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.14em] text-[#18181B] ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="inline-block h-4 w-4 rounded bg-emerald-600" />
          {label}
        </span>
      )}
      <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.0] tracking-tight text-[#18181B] sm:text-5xl lg:text-6xl">
        {fullHeading}
      </h2>
      {body && (
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#71717A]">{body}</p>
      )}
    </div>
  );
}
