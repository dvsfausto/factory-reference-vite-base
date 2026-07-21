import { Star, Quote } from "lucide-react";
import { resolveCharacterTokens } from "~/lib/character-tokens";
import type { Review } from "~/lib/types/page-types";

const PLATFORM_COLORS: Record<
  'google' | 'yelp' | 'manual' | 'direct' | 'hybrid',
  string
> = {
  google: "bg-blue-50 text-blue-700",
  yelp: "bg-red-50 text-red-700",
  manual: "bg-slate-50 text-slate-700",
  direct: "bg-slate-50 text-slate-700",
  hybrid: "bg-purple-50 text-purple-700",
};

export function ReviewCard({ review }: { review: Review }) {
  // Character tokens (see character-tokens.ts). null → known verticals keep the
  // literals verbatim (byte-identical — SHARED component). brand watermark + rating
  // stars + source chips stay per decision (brand/semantic accents not tokenized).
  const T = resolveCharacterTokens();
  const tCard = T ? `${T.card} ${T.cardRadius} border ${T.border} ${T.cardElevation}` : "card-stead";
  const tBody = T?.text ?? "text-ink-700";
  const tStrong = T?.text ?? "text-ink-900";
  const tMuted = T?.muted ?? "text-ink-500";
  const tBorder = T ? T.border : "border-ink-100";

  return (
    <div className={`${tCard} p-7 h-full flex flex-col relative overflow-hidden`}>
      <Quote className="absolute -top-2 -right-2 h-20 w-20 text-brand-50" strokeWidth={1} />
      <div className="flex items-start justify-between mb-3 relative">
        <div className="flex gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        {review.source && (
          <span className={`badge-pill text-[10px] capitalize ${PLATFORM_COLORS[review.source]}`}>
            {review.source}
          </span>
        )}
      </div>
      <p className={`${tBody} leading-relaxed flex-1 relative font-sans-body not-italic text-lg`}>"{review.text}"</p>
      <div className={`mt-5 pt-4 border-t ${tBorder} text-sm`}>
        <div className={`font-semibold ${tStrong}`}>
          {review.author}
          {review.location && (
            <span className={`${tMuted} font-normal`}> · {review.location}</span>
          )}
        </div>
        {(review.service || review.date) && (
          <div className={`text-xs ${tMuted} mt-0.5`}>
            {[review.service, review.date].filter(Boolean).join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
}
