interface Props {
  label?: string;
  heading: string;
  scriptAccent?: string;
  body?: string;
  align?: "center" | "left";
}

export function SectionHeader({ label, heading, scriptAccent, body, align = "center" }: Props) {
  const alignClass = align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl";

  return (
    <div className={`${alignClass} mb-12`}>
      {align === "center" && (
        <div className="divider-diamond mb-4"><span>◆</span></div>
      )}
      {label && (
        <span className="badge-pill bg-brand-50 text-brand-600">{label}</span>
      )}
      <h2 className="mt-4">
        {heading}
        {scriptAccent && (
          <> <span className="font-script text-brand-600">{scriptAccent}</span></>
        )}
      </h2>
      {body && <p className="mt-3 text-ink-500">{body}</p>}
    </div>
  );
}
