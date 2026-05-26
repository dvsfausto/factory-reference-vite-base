import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
            {it.to ? (
              <Link to={it.to} className="hover:text-brand-600">{it.label}</Link>
            ) : (
              <span className="text-ink-900 font-medium">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
