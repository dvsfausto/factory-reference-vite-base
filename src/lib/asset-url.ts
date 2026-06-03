// Resolves an image reference to a servable URL. Full URLs and absolute
// paths pass through unchanged; bare filenames get the /images/ prefix
// (the scaffolder writes hero/service/area images into public/images/).
// Mirrors factory-reference-vite-painter/src/lib/asset-url.ts.
export function imageSrc(ref: string): string {
  if (/^(https?:)?\/\//.test(ref) || ref.startsWith("/")) return ref;
  return `/images/${ref}`;
}
