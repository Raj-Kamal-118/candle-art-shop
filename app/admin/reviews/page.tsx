"use client";

import { useEffect, useState } from "react";
import { Star, Check, X, Trash2, Image as ImageIcon } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved: !currentStatus }),
    });
    fetchReviews();
  };

  const deleteReview = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      fetchReviews();
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-brown-500 dark:text-amber-100/50">
        Loading Reviews...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-brown-900 dark:text-amber-100">
          Customer Reviews
        </h1>
        <p className="text-sm text-brown-500 dark:text-amber-100/60">
          {reviews.length} total reviews
        </p>
      </div>

      <div className="bg-white dark:bg-[#1a1830] rounded-2xl shadow-sm border border-cream-200 dark:border-amber-900/30 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-cream-50 dark:bg-[#12101e] border-b border-cream-200 dark:border-amber-900/30">
            <tr>
              <th className="px-6 py-4 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                Customer & Product
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider w-1/3">
                Review Text
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider text-center">
                Image
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider text-center">
                Status
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold text-brown-500 dark:text-amber-100/60 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-100 dark:divide-amber-900/20">
            {reviews.map((review) => (
              <tr
                key={review.id}
                className="hover:bg-cream-50/50 dark:hover:bg-amber-900/10 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-brown-900 dark:text-amber-100">
                    {review.customer_name}
                  </p>
                  <p className="text-xs text-brown-500 dark:text-amber-100/60">
                    {review.location}
                  </p>
                  <p className="text-xs font-medium text-amber-600 mt-1">
                    {review.product_name}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className="text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-brown-600 dark:text-amber-100/70 line-clamp-3 italic">
                    "{review.text}"
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  {review.image_url ? (
                    <a
                      href={review.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block relative group"
                    >
                      <img
                        src={review.image_url}
                        alt="Review"
                        className="w-10 h-10 object-cover rounded-lg border border-cream-200 dark:border-amber-900/40"
                      />
                    </a>
                  ) : (
                    <span className="text-cream-300 dark:text-amber-900/40 flex justify-center">
                      <ImageIcon size={20} />
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider font-bold ${review.approved ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300" : "bg-cream-100 text-brown-600 dark:bg-amber-900/30 dark:text-amber-100/70"}`}
                  >
                    {review.approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleApproval(review.id, review.approved)}
                      title={
                        review.approved
                          ? "Hide from website"
                          : "Approve to website"
                      }
                      className={`p-2 rounded-lg transition-colors ${review.approved ? "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20" : "text-forest-600 dark:text-forest-400 hover:bg-forest-50 dark:hover:bg-forest-900/20"}`}
                    >
                      {review.approved ? <X size={16} /> : <Check size={16} />}
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      title="Delete review"
                      className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-brown-500 dark:text-amber-100/60"
                >
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
