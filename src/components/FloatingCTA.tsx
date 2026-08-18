import { Sparkles } from "lucide-react";
import { SITE } from "~/data/site";
import { PrimaryCta } from "~/components/blocks/PrimaryCta";
import { primaryCta } from "~/lib/primaryCta";

type Props = {
  to?: string;
  label?: string;
};

// Sticky mobile CTA — defaults to the AFFORDANCE (target + label) like every other CTA, so a quote-only
// site's floating button says "Get a quote" → /quote, not a hardcoded "Free Quote" → /contact. Callers
// may still override; an emitted SITE.ctaLabel (editable) wins on the label.
export function FloatingCTA({ to, label }: Props) {
  const affordanceLabel = (SITE as { ctaLabel?: string }).ctaLabel ?? label ?? primaryCta().label;
  return (
    <PrimaryCta
      to={to}
      className="lg:hidden fixed bottom-4 right-4 z-30 btn btn-md btn-primary shadow-xl"
    >
      <Sparkles className="h-4 w-4" />
      {affordanceLabel}
    </PrimaryCta>
  );
}
