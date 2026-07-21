import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { SITE } from "~/data/site";

type Props = {
  to?: string;
  label?: string;
};

export function FloatingCTA({ to = "/contact", label = (SITE as { ctaLabel?: string }).ctaLabel ?? "Free Quote" }: Props) {
  return (
    <Link
      to={to}
      className="lg:hidden fixed bottom-4 right-4 z-30 btn btn-md btn-primary shadow-xl"
    >
      <Sparkles className="h-4 w-4" />
      {label}
    </Link>
  );
}
