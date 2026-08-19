// Section-header VARIANT: modern (clean + contemporary). The modern analog of the
// other character headers — a NEW component. Clean geometric sans (font-display,
// set to Sora by the DNA), generous type scale, a restrained eyebrow (a thin
// indigo rule + a wide-tracked label — NO diamond divider, NO script flourish, NO
// rounded dot). Cool light surface text.
//
// TOKEN DISCIPLINE: font-display (DNA sans); emerald-* (DNA accent → indigo) for
// the eyebrow; cool neutrals hardcoded (slate #0F172A / #64748B) — contained to
// the modern components. No font-script, no bg-brand-*, no .btn. Same Props shape
// as the other section headers (drop-in).
interface Props {
  label?: string;
  heading: string;
  scriptAccent?: string;
  body?: string;
  align?: "center" | "left";
}

export function SectionHeaderModern({
  label,
  heading,
  scriptAccent,
  body,
  align = "left",
}: Props) {
  const alignClass =
    align === "center" ? "items-center text-center mx-auto max-w-2xl" : "max-w-2xl";
  const fullHeading = scriptAccent ? `${heading} ${scriptAccent}` : heading;

  // EYEBROW CLEARED (taste-skill: max ~1 eyebrow per 3 sections — the hero's kicker is the family's one).
  // The heading alone carries the section; the label is intentionally not rendered.
  void label;
  return (
    <div className={`flex flex-col ${alignClass} mb-14`}>
      <h2 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-[#0F172A] sm:text-5xl">
        {fullHeading}
      </h2>
      {body && (
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#64748B]">{body}</p>
      )}
    </div>
  );
}
