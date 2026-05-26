type Props = {
  src?: string;
  alt?: string;
  className?: string;
  light?: boolean;
  height?: number;
};

export function Logo({ src, alt = "Logo", className = "", light = false, height = 40 }: Props) {
  if (!src) return null;
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
