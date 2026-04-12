import { getApprovedReviews } from "@/lib/reviews";
import { Star, Quote } from "lucide-react";
import Link from "next/link";

export default async function ReviewsPage() {
  const reviews = await getApprovedReviews();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-brown-900 dark:text-amber-100 mb-4">
          Customer Reviews
        </h1>
        <p className="text-lg text-brown-600 dark:text-amber-100/70 max-w-2xl mx-auto">
          Read what our wonderful customers have to say about their experiences
          with our handcrafted pieces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col h-full bg-white dark:bg-[#1a1830] shadow-sm rounded-3xl p-8 relative border border-cream-200 dark:border-amber-900/30"
          >
            <Quote
              className="text-amber-100 dark:text-amber-900/40 absolute top-8 right-8"
              size={40}
            />
            <div className="flex items-center gap-1 mb-6">
              {[...Array(review.rating)].map((_, j) => (
                <Star
                  key={j}
                  size={16}
                  className="text-amber-400 fill-amber-400"
                />
              ))}
            </div>

            {review.image_url && (
              <div className="mb-6 relative w-full h-48 rounded-2xl overflow-hidden bg-cream-50 dark:bg-amber-900/20">
                <img
                  src={review.image_url}
                  alt={`Review photo by ${review.customer_name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="text-brown-700 dark:text-amber-100/80 text-base leading-relaxed mb-6 relative z-10 flex-grow italic">
              "{review.text}"
            </p>

            <div className="mt-auto pt-6 border-t border-cream-100 dark:border-amber-900/30">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-brown-900 dark:text-white font-bold">
                    {review.customer_name}
                  </p>
                  <p className="text-brown-500 dark:text-amber-100/50 text-sm">
                    {review.location || "Verified Buyer"}
                  </p>
                </div>
              </div>
              <p className="text-amber-700 dark:text-amber-400 font-medium text-sm mt-1">
                Purchased:{" "}
                <span className="font-semibold">{review.product_name}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
