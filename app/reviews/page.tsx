import { getApprovedReviews } from "@/lib/reviews";
import { Star } from "lucide-react";
import Link from "next/link";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();

  const count = reviews.length || 0;
  const average = count
    ? reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / count
    : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r: any) => r.rating === star).length,
  }));

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      <SecondaryHeader
        eyebrow="✦ What our customers say ✦"
        titlePrefix="Stories of"
        titleHighlighted="Warmth"
        description="Read what our wonderful customers have to say about their experiences with our handcrafted pieces."
      />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="font-serif text-[72px] font-bold text-brown-900 dark:text-amber-100 leading-none">
                {average.toFixed(1)}
              </div>
              <div className="flex gap-0.5 mt-2 justify-center md:justify-start">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(average)
                        ? "text-amber-400 fill-amber-400"
                        : "text-cream-300 dark:text-amber-900/40"
                    }
                  />
                ))}
              </div>
              <div className="text-sm text-brown-600 dark:text-amber-100/60 mt-2">
                Based on {count} review{count === 1 ? "" : "s"}
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col gap-2">
              {distribution.map(({ star, count: c }) => {
                const pct = count ? (c / count) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-sm">
                    <span className="w-8 text-brown-700 dark:text-amber-100/70 flex items-center gap-1">
                      {star}
                      <Star
                        size={12}
                        className="text-amber-400 fill-amber-400"
                      />
                    </span>
                    <div className="flex-1 h-2 bg-cream-100 dark:bg-amber-900/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-brown-500 dark:text-amber-100/50">
                      {c}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review: any) => (
            <Link
              key={review.id}
              href={`/review/${review.id}`}
              className="group flex flex-col bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className="text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              {review.title && (
                <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100 mb-3">
                  {review.title}
                </h3>
              )}

              <p className="text-brown-700 dark:text-amber-100/80 text-[15px] leading-[1.7] mb-5 italic flex-grow">
                &ldquo;{review.text}&rdquo;
              </p>

              {review.image_url && (
                <div className="mb-5 w-full aspect-[4/3] rounded-xl overflow-hidden bg-cream-50 dark:bg-amber-900/10">
                  <img
                    src={review.image_url}
                    alt={`Review photo by ${review.customer_name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="mt-auto pt-5 border-t border-cream-100 dark:border-amber-900/20 flex items-center justify-between">
                <div>
                  <p className="text-brown-900 dark:text-amber-100 font-semibold text-sm">
                    {review.customer_name}
                  </p>
                  <p className="text-brown-500 dark:text-amber-100/50 text-xs">
                    {review.location || "Verified Buyer"}
                  </p>
                </div>
                {review.product_name && (
                  <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full">
                    {review.product_name}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
