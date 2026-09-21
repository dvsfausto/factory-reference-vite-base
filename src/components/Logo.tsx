import { SITE } from "~/data/site";

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  light?: boolean;
  height?: number;
  /**
   * The LIGHT/KNOCKOUT logo variant (SITE.logo_light_url). A GENUINELY distinct knockout
   * (lightSrc !== src) reads on a dark ground and is rendered as-is. But ~75 of the fleet's
   * kits are uploaded logos whose light slot is a COPY of the primary — lightSrc === src —
   * so there is no real knockout and the footer must not pretend there is one.
   */
  lightSrc?: string;
};

/**
 * Footer arc (2026-09-16). The footer knows it is on a dark ground (`light`) and measures the
 * situation against THAT, not a generic "dark":
 *   1. A distinct knockout exists (lightSrc && lightSrc !== src) → render it; it reads on dark.
 *   2. No distinct knockout on a dark ground → the only mark we have is the colour/primary logo
 *      (an uploaded navy mark on a dark-navy footer measures 1.28:1 — invisible). NEITHER variant
 *      reads on this ground, so put the mark on a light PLATE, exactly as the email frames do.
 *      The plate is white, so any dark or colour mark clears well past 3:1.
 *   3. Light ground → the colour logo reads as-is.
 * Synchronous (no canvas probe), so the decision is baked into the prerendered HTML and needs no JS.
 *
 * ★ THE LIGHT MARK (dark-site arc, 2026-09-21). An uploaded logo that is ITSELF light (a white mark on
 * transparency) broke both branches: invisible on a light header, and on a WHITE plate in the footer.
 * The scaffolder measures the file at build (factory lib/logo-tone.ts) and emits SITE.logoTone = "light"
 * only for such a mark, so for the site's own logo:
 *   · dark ground, no distinct knockout → the mark itself reads there: render it as-is, no plate;
 *   · light ground → put it on a DARK plate (the mirror of the white one).
 * Absent (every dark or colour logo) → the three branches above, unchanged.
 */
export function Logo({ src, alt = "Logo", className = "", light = false, height = 40, lightSrc }: Props) {
  // No logo asset → the business name as a text wordmark, never a broken/empty <img>.
  if (!src) {
    return (
      <span
        className={`font-display font-semibold tracking-tight leading-none ${
          light ? "text-fam-on-dark" : "text-ink-900"
        } ${className}`}
        style={{ fontSize: Math.round(height * 0.5) }}
      >
        {alt}
      </span>
    );
  }

  const hasKnockout = !!lightSrc && lightSrc !== src;
  const lightMark = (SITE as { logoTone?: string }).logoTone === "light" && src === SITE.logo_url;

  // 1. A real knockout on a dark ground: render it directly (no filter).
  if (light && hasKnockout) {
    return (
      <div className={`flex items-center ${className}`}>
        <img src={lightSrc} alt={alt} height={height} style={{ height, width: "auto" }} />
      </div>
    );
  }

  // 1b. Dark ground, the mark is itself light: it reads as-is.
  if (light && lightMark) {
    return (
      <div className={`flex items-center ${className}`}>
        <img src={src} alt={alt} height={height} style={{ height, width: "auto" }} />
      </div>
    );
  }

  // 2. Dark ground, no real knockout: neither variant reads → PLATE the mark so it is legible.
  // 3b. Light ground, a light mark: the same plate, dark — a white mark on #111111 is ~18:1.
  if (light || lightMark) {
    const pad = Math.max(6, Math.round(height * 0.18));
    return (
      <div className={`inline-flex items-center ${className}`}>
        <span
          style={{
            background: light ? "#ffffff" : "#111111",
            borderRadius: Math.round(height * 0.2),
            padding: `${pad}px ${Math.round(pad * 1.4)}px`,
            display: "inline-flex",
            alignItems: "center",
            lineHeight: 0,
          }}
        >
          <img src={src} alt={alt} height={height} style={{ height, width: "auto" }} />
        </span>
      </div>
    );
  }

  // 3. Light ground: the colour logo reads as-is.
  return (
    <div className={`flex items-center ${className}`}>
      <img src={src} alt={alt} height={height} style={{ height, width: "auto" }} />
    </div>
  );
}
