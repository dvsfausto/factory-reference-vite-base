import { Star, Quote } from "lucide-react";
import type { Review } from "~/lib/types/page-types";

const PLATFORM_COLORS: Record<Review["source"], string> = {
  google: "bg-blue-50 text-blue-700",
  yelp: "bg-red-50 text-red-700",
  manual: "bg-slate-50 text-slate-700",
  direct: "bg-slate-50 text-slate-700",
  hybrid: "bg-purple-50 text-purple-700",
};

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="card-stead p-7 h-full flex flex-col relative overflow-hidden">
      <Quote className="absolute -top-2 -right-2 h-20 w-20 text-brand-50" strokeWidth={1} />
      <div className="flex items-start justify-between mb-3 relative">
        <div className="flex gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        <span className={`badge-pill text-[10px] capitalize ${PLATFORM_COLORS[review.source]}`}>
          {review.source}
        </span>
      </div>
      <p className="text-ink-700 leading-relaxed flex-1 relative font-sans-body not-italic text-lg">"{review.text}"</p>
      <div className="mt-5 pt-4 border-t border-ink-100 text-sm">
        <div className="font-semibold text-ink-900">
          {review.authorName}
          {review.location && (
            <span className="text-ink-500 font-normal"> · {review.location}</span>
          )}
        </div>
        {(review.serviceUsed || review.date) && (
          <div className="text-xs text-ink-500 mt-0.5">
            {[review.serviceUsed, review.date].filter(Boolean).join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
}
