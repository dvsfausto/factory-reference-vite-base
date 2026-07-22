import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { resolveCharacterTokens } from "~/lib/character-tokens";

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  // Inner-page chrome: on a character site the link-hover adopts the character accent
  // (emerald), matching the sections below; known verticals keep brand hover (byte-identical).
  const T = resolveCharacterTokens();
  const linkHover = T ? T.accentHover.split(" ").filter((c) => c.startsWith("hover:text-")).join(" ") : "hover:text-brand-600";
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
            {it.to ? (
              <Link to={it.to} className={linkHover}>{it.label}</Link>
            ) : (
              <span className="text-ink-900 font-medium">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
