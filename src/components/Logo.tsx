type Props = {
  src?: string;
  alt?: string;
  className?: string;
  light?: boolean;
  height?: number;
};

export function Logo({ src, alt = "Logo", className = "", light = false, height = 40 }: Props) {
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
          filter: light ? "brightness(0) invert(1)" : undefined,
        }}
      />
    </div>
  );
}
