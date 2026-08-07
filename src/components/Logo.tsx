import { useEffect, useState } from "react";

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  light?: boolean;
  height?: number;
};

export function Logo({ src, alt = "Logo", className = "", light = false, height = 40 }: Props) {
  // RENDER GUARD (footer white-box). `brightness(0) invert(1)` whitens a dark logo so it reads on the
  // dark footer — but it turns a logo with a BAKED OPAQUE background (an uploaded screenshot, a JPEG,
  // a white-bg PNG) into a solid WHITE BOX. Default to the historical behaviour (invert when `light`)
  // so TRANSPARENT logos render BYTE-IDENTICALLY and never flash; only DISABLE the invert once we detect
  // the asset is opaque, so a logo that slipped through renders visibly ("ugly rather than blank").
  // We probe a CLEAN copy — reading the on-page <img> would sample the already-FILTERED pixels.
  const [opaqueBg, setOpaqueBg] = useState(false);
  useEffect(() => {
    if (!src || !light) return; // the invert only applies when `light`; nothing to guard otherwise
    let cancelled = false;
    const probe = new Image();
    probe.crossOrigin = "anonymous"; // required to read cross-origin pixels; denied → caught below
    probe.onload = () => {
      try {
        const w = probe.naturalWidth, h = probe.naturalHeight;
        if (!w || !h) return;
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = h;
        const ctx = cv.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(probe, 0, 0);
        const corners: Array<[number, number]> = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]];
        const opaque = corners.every(([x, y]) => ctx.getImageData(x, y, 1, 1).data[3] > 250);
        if (!cancelled && opaque) setOpaqueBg(true);
      } catch {
        /* cross-origin taint or no canvas → keep the default (invert): no worse than before */
      }
    };
    probe.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, light]);

  // No logo asset (e.g. a build with no brand kit) → render the business name as a
  // text wordmark, never a broken/empty <img>. Keeps logo-less builds branded.
  if (!src) {
    return (
      <span
        className={`font-display font-semibold tracking-tight leading-none ${
          light ? "text-white" : "text-ink-900"
        } ${className}`}
        style={{ fontSize: Math.round(height * 0.5) }}
      >
        {alt}
      </span>
    );
  }
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={src}
        alt={alt}
        height={height}
        style={{
          height,
          width: "auto",
          // Invert only for a TRANSPARENT logo (opaqueBg=false → byte-identical to before). An opaque
          // logo keeps its own colours instead of becoming a white box.
          filter: light && !opaqueBg ? "brightness(0) invert(1)" : undefined,
        }}
      />
    </div>
  );
}
