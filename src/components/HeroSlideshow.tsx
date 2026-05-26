import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";

interface SlideImage {
  src: string;
  alt: string;
}

interface ReviewBadge {
  rating: number;
  text: string;
}

interface Props {
  images: SlideImage[];
  variant?: "single" | "slideshow";
  reviewBadge?: ReviewBadge;
  intervalMs?: number;
}

const DEFAULT_INTERVAL = 5000;

export function HeroSlideshow({
  images,
  variant = "slideshow",
  reviewBadge,
  intervalMs = DEFAULT_INTERVAL,
}: Props) {
  const isSlideshow = variant === "slideshow" && images.length > 1;
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isSlideshow || !mounted || paused) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(id);
  }, [isSlideshow, mounted, paused, images.length, intervalMs]);

  if (images.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative rounded-[28px] overflow-hidden shadow-2xl shadow-brand-900/20 border-4 border-white aspect-[4/3] bg-brand-50">
        {!isSlideshow || !mounted ? (
          <img
            src={images[0].src}
            alt={images[0].alt}
            width={1600}
            height={1200}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index].src}
              alt={images[index].alt}
              width={1600}
              height={1200}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.1 }, scale: { duration: 6, ease: "easeOut" } }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        )}

        {isSlideshow && (
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Show slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-white" : "w-2 bg-white/60 hover:bg-white/90"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {reviewBadge && (
        <div className="absolute -bottom-6 -left-4 lg:left-auto lg:-right-4 card-stead p-4 max-w-[260px] z-20 bg-white">
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            ))}
            <span className="ml-1 text-sm font-semibold text-ink-900">{reviewBadge.rating}</span>
          </div>
          <p className="text-xs text-ink-500">{reviewBadge.text}</p>
        </div>
      )}
    </div>
  );
}
