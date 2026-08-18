import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { resolveCharacterTokens } from "~/lib/character-tokens";
import { tr } from "~/lib/i18n";

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  // Inner-page chrome: on a character site the link-hover adopts the character accent
  // (emerald), matching the sections below; known verticals keep brand hover (byte-identical).
  const T = resolveCharacterTokens();
  // When the crumb sits over a DARK hero (bold), its band uses the character's `crumb` tone (light
  // text on the dark surface); otherwise it keeps the section-appropriate T.muted/T.text. Known
  // verticals (T null) → default ink, byte-identical.
  const crumbMuted = T?.crumb?.muted ?? T?.muted ?? "text-ink-500";
  const crumbText = T?.crumb?.text ?? T?.text ?? "text-ink-900";
  const linkHover = T ? T.accentHover.split(" ").filter((c) => c.startsWith("hover:text-")).join(" ") : "hover:text-brand-600";
  return (
    <nav aria-label={tr('breadcrumb.aria')} className={`text-sm ${crumbMuted}`}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
            {it.to ? (
              <Link to={it.to} className={linkHover}>{it.label}</Link>
            ) : (
              <span className={`${crumbText} font-medium`}>{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
