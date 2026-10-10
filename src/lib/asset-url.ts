// Resolves an image reference to a servable URL. Full URLs and absolute
// paths pass through unchanged; bare filenames get the /images/ prefix
// (the scaffolder writes hero/service/area images into public/images/).
// Mirrors factory-reference-vite-painter/src/lib/asset-url.ts.
//
// PERF-1 (overlay rollout S3c, 2026-09-03): a Supabase Storage PUBLIC OBJECT URL — the
// owner tier (uploaded hero / service / gallery photos, logos) — is routed through the
// project's image transform endpoint (`/storage/v1/render/image/public/…`). Measured on the
// FaustosCutz hero before this change: the raw upload was 4,418,130 B jpeg (5184×3456,
// `cache-control: no-cache`); the same object at width=1600&resize=contain&quality=70 is
// 79,572 B webp (1600×1067). `resize=contain` is REQUIRED — the default `cover` with a
// width alone keeps the original height and crops a centre strip (800×3456, measured).
// The transform never upscales (an 835 px logo stays 835 px) and keeps alpha. SVG and
// GIF are passed through untouched (vector / animation would not survive a raster resize).
// Static-tier images under /images/ are already webp from the pipeline and are not touched.
const STORAGE_PUBLIC_OBJECT = /\/storage\/v1\/object\/public\//;
const UNTRANSFORMABLE = /\.(svg|gif)(\?.*)?$/i;
export const IMAGE_TRANSFORM_WIDTH = 1600;
export const IMAGE_TRANSFORM_QUALITY = 70;

// The full-bleed hero is the one picture drawn at the viewport's width: it gets its own, larger transform
// (2400 wide, quality 80) plus a srcset, so a wide or 2x screen is not fed a 1600 px upscale (ZB-154: a
// 2400 px upload read as blurry). Everything else keeps imageSrc() above. A non-storage ref passes through.
// (plain JS syntax below: scripts/check-image-transform.mjs evaluates this file with the type words stripped)
export const HERO_TRANSFORM_WIDTHS = [1200, 1600, 2400];
export const HERO_TRANSFORM_QUALITY = 80;
export function heroImageSrc(ref: string, width = 2400): string {
  if (STORAGE_PUBLIC_OBJECT.test(ref) && !UNTRANSFORMABLE.test(ref) && !ref.includes("?")) {
    return ref.replace(STORAGE_PUBLIC_OBJECT, "/storage/v1/render/image/public/") + `?width=${width}&resize=contain&quality=${HERO_TRANSFORM_QUALITY}`;
  }
  return imageSrc(ref);
}
export function heroImageSrcSet(ref: string) {
  if (!(STORAGE_PUBLIC_OBJECT.test(ref) && !UNTRANSFORMABLE.test(ref) && !ref.includes("?"))) return undefined;
  return HERO_TRANSFORM_WIDTHS.map((w) => `${heroImageSrc(ref, w)} ${w}w`).join(", ");
}

export function imageSrc(ref: string): string {
  if (STORAGE_PUBLIC_OBJECT.test(ref) && !UNTRANSFORMABLE.test(ref) && !ref.includes("?")) {
    return (
      ref.replace(STORAGE_PUBLIC_OBJECT, "/storage/v1/render/image/public/") +
      `?width=${IMAGE_TRANSFORM_WIDTH}&resize=contain&quality=${IMAGE_TRANSFORM_QUALITY}`
    );
  }
  if (/^(https?:)?\/\//.test(ref) || ref.startsWith("/")) return ref;
  return `/images/${ref}`;
}
