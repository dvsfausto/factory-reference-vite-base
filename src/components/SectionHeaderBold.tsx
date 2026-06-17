// Section-header VARIANT: bold/solid. The default SectionHeader renders a
// script-italic accent word + a diamond divider + a soft brand-tinted pill —
// the strongest remaining "wellness boutique" signals. This variant kills all
// three: a solid UPPERCASE Oswald heading, an emerald accent rule for the
// eyebrow, square structural corners. Same Props shape as SectionHeader so it is
// a drop-in (scriptAccent is accepted for parity but rendered solid, never as
// font-script).
//
// TOKEN DISCIPLINE: font-display (DNA Oswald) on the heading; emerald-* (DNA
// accent) for the eyebrow rule + label; ink-* neutrals. No font-script, no
// bg-brand-*, no .btn.
interface Props {
  label?: string;
  heading: string;
  scriptAccent?: string;
  body?: string;
  align?: "center" | "left";
}

export function SectionHeaderBold({
  label,
  heading,
  scriptAccent,
  body,
  align = "left",
}: Props) {
  const alignClass =
    align === "center" ? "text-center max-w-2xl mx-auto items-center" : "max-w-2xl";
  // Keep the accent word as part of the solid heading (no script styling), so
  // the full phrase survives without the wellness flourish.
  const fullHeading = scriptAccent ? `${heading} ${scriptAccent}` : heading;

  return (
    <div className={`flex flex-col ${alignClass} mb-12`}>
      {label && (
        <span
          className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="inline-block h-3 w-3 bg-emerald-600" />
          {label}
        </span>
      )}
      <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.98] tracking-tight text-ink-900 sm:text-5xl">
        {fullHeading}
      </h2>
      {body && <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-700">{body}</p>}
    </div>
  );
}
