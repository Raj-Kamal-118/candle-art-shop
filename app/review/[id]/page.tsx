import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, BadgeCheck, ThumbsUp, ThumbsDown, ArrowRight } from "lucide-react";
import { getReviewById } from "@/lib/reviews";

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function ReviewDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const review: any = await getReviewById(params.id);
  if (!review) notFound();

  const photos: string[] = Array.isArray(review.photos)
    ? review.photos
    : review.image_url
    ? [review.image_url]
    : [];
  const helpfulYes = review.helpful_yes ?? 0;
  const helpfulNo = review.helpful_no ?? 0;

  return (
    <div className="bg-cream-50 dark:bg-[#0f0e1c] pt-10 pb-20 min-h-screen">
      <div className="max-w-[880px] mx-auto px-6">
        <Link
          href="/reviews"
          className="inline-flex items-center gap-2 text-sm text-brown-700 dark:text-amber-100/70 hover:text-coral-600 dark:hover:text-coral-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to reviews
        </Link>

        <article className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-[20px] p-8 md:p-10 mb-8">
          <header className="flex flex-wrap items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center justify-center font-semibold flex-none">
              {initials(review.customer_name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-brown-900 dark:text-amber-100">
                  {review.customer_name}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.1em] uppercase text-forest-700 dark:text-forest-300 bg-forest-50 dark:bg-forest-900/30 px-2 py-0.5 rounded-full">
                  <BadgeCheck size={12} /> Verified
                </span>
              </div>
              <div className="text-xs text-brown-500 dark:text-amber-100/50 mt-0.5">
                {review.location || "Verified Buyer"}
                {formatDate(review.created_at) && (
                  <> · {formatDate(review.created_at)}</>
                )}
              </div>
            </div>
          </header>

          <div className="flex gap-0.5 mb-5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < (review.rating || 0)
                    ? "text-amber-400 fill-amber-400"
                    : "text-cream-300 dark:text-amber-900/40"
                }
              />
            ))}
          </div>

          {review.title && (
            <h1 className="font-serif text-3xl md:text-[36px] font-bold text-brown-900 dark:text-amber-100 leading-[1.15] mb-6">
              {review.title}
            </h1>
          )}

          <p
            className="font-serif italic text-[19px] md:text-[20px] leading-[1.7] text-brown-800 dark:text-amber-100/80"
            style={{ borderLeft: "3px solid var(--coral-400, #f07b72)", paddingLeft: 28 }}
          >
            &ldquo;{review.text}&rdquo;
          </p>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
              {photos.slice(0, 6).map((src, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden bg-cream-100 dark:bg-amber-900/10"
                >
                  <img
                    src={src}
                    alt={`Review photo ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          )}
        </article>

        {review.product_name && (
          <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-6 mb-8 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-400 mb-1">
                Reviewed product
              </div>
              <div className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100">
                {review.product_name}
              </div>
            </div>
            <Link
              href={`/products?search=${encodeURIComponent(review.product_name)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-coral-600 hover:bg-coral-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-coral-200 dark:shadow-coral-900/30 hover:-translate-y-0.5 transition-all"
            >
              Shop this piece <ArrowRight size={14} />
            </Link>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm text-brown-600 dark:text-amber-100/60">
            Was this review helpful?
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-full text-sm text-brown-800 dark:text-amber-100/80 hover:border-forest-300 hover:text-forest-700 transition-colors"
            >
              <ThumbsUp size={14} /> Yes · {helpfulYes}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-full text-sm text-brown-800 dark:text-amber-100/80 hover:border-brown-300 hover:text-brown-700 transition-colors"
            >
              <ThumbsDown size={14} /> No · {helpfulNo}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
