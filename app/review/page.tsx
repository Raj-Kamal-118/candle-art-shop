"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Star,
  Check,
  Image as ImageIcon,
  Package,
  ArrowRight,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

function ReviewForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order") || "";

  const [order, setOrder] = useState<any>(null);
  const [loadingOrder, setLoadingOrder] = useState(!!orderId);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        const addr = data?.shippingAddress || data?.shipping_address;
        if (addr) {
          const name =
            addr.fullName ||
            [addr.firstName, addr.lastName].filter(Boolean).join(" ");
          if (name) setCustomerName(name);

          const loc = [addr.city, addr.country].filter(Boolean).join(", ");
          if (loc) setLocation(loc);
        }
      })
      .finally(() => setLoadingOrder(false));
  }, [orderId]);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Per-product reviews
  const [productReviews, setProductReviews] = useState<
    Record<string, { rating: number; text: string }>
  >({});
  const [expandedProducts, setExpandedProducts] = useState<
    Record<string, boolean>
  >({});

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const newImages = [...images];

    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append("file", files[i]);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (res.ok) {
          const { url } = await res.json();
          newImages.push(url);
        }
      } catch (error) {
        console.error("Upload error", error);
      }
    }

    setImages(newImages);
    setUploadingImages(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        order_id: orderId,
        customer_name: customerName,
        location,
        title,
        rating,
        text,
        images,
        product_id: order?.items?.[0]?.productId || null,
        product_name: order?.items?.[0]?.productName || null,
        product_reviews: Object.entries(productReviews)
          .filter(([_, rev]) => rev.rating > 0 && rev.text.trim() !== "")
          .map(([pid, rev]) => ({
            product_id: pid,
            product_name: order?.items?.find((i: any) => i.productId === pid)
              ?.productName,
            rating: rev.rating,
            text: rev.text,
          })),
      };

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit review");
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit review", error);
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center min-h-[60vh] flex flex-col justify-center">
        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <Check size={48} />
        </div>
        <h2 className="font-serif text-4xl font-bold text-brown-900 dark:text-amber-100 mb-4">
          Thank you for sharing your story.
        </h2>
        <p className="text-brown-600 dark:text-amber-100/70 mb-10 text-lg">
          Every review is read by the hands that poured your candle. Your
          thoughts mean the world to our small artisan team.
        </p>
        <Button
          onClick={() => router.push("/reviews")}
          size="lg"
          className="mx-auto"
        >
          Read Other Reviews <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    );
  }

  if (loadingOrder) {
    return (
      <div className="text-center py-32 text-amber-800">
        Finding your order...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-white dark:bg-[#1a1830] p-8 sm:p-10 rounded-3xl shadow-[0_12px_32px_rgba(28,18,9,0.06)] border border-cream-200 dark:border-amber-900/30 text-center">
          <h2 className="font-serif text-3xl font-bold text-brown-900 dark:text-amber-100 mb-2">
            How was your experience?
          </h2>
          {orderId && (
            <p className="text-brown-500 dark:text-amber-100/60 mb-8">
              Order #{orderId.slice(-8).toUpperCase()}
            </p>
          )}

          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    size={36}
                    className={`transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-cream-300 dark:text-amber-900/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="text-left space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-brown-900 dark:text-amber-100 mb-2">
                  Your Name *
                </label>
                <input
                  required
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-brown-800 dark:text-amber-100"
                  placeholder="Jane D."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brown-900 dark:text-amber-100 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-brown-800 dark:text-amber-100"
                  placeholder="e.g. Mumbai, India"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-900 dark:text-amber-100 mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-brown-800 dark:text-amber-100"
                placeholder="e.g. A new evening ritual"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-900 dark:text-amber-100 mb-2">
                Your Story *
              </label>
              <textarea
                required
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-4 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-brown-800 dark:text-amber-100 resize-none"
                placeholder="What did you love about your items?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brown-900 dark:text-amber-100 mb-3">
                Add photos (optional)
              </label>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    id="review-image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                  />
                  <label
                    htmlFor="review-image"
                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-cream-100 dark:bg-amber-900/20 text-brown-700 dark:text-amber-100/80 rounded-xl hover:bg-cream-200 transition-colors border border-cream-200 dark:border-amber-900/40 text-sm font-medium"
                  >
                    <ImageIcon size={16} />{" "}
                    {uploadingImages ? "Uploading..." : "Upload Photos"}
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded-xl overflow-hidden border border-cream-300 dark:border-amber-900/40 shadow-sm"
                      >
                        <img
                          src={img}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setImages(images.filter((_, i) => i !== idx))
                          }
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Specific Item Reviews */}
        {order?.items && order.items.length > 0 && (
          <div>
            <h3 className="font-serif text-xl font-bold text-brown-900 dark:text-amber-100 mb-4 flex items-center gap-2">
              <Package size={20} className="text-amber-600" /> Review specific
              items
            </h3>
            <div className="space-y-4">
              {order.items.map((item: any, i: number) => {
                const isExpanded = expandedProducts[item.productId];
                const pReview = productReviews[item.productId] || {
                  rating: 0,
                  text: `I purchased the ${item.productName} and `,
                };

                return (
                  <div
                    key={i}
                    className="bg-white dark:bg-[#1a1830] rounded-2xl border border-cream-200 dark:border-amber-900/30 overflow-hidden shadow-sm"
                  >
                    <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-14 h-14 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-xl">
                            🎁
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-brown-900 dark:text-amber-100">
                            {item.productName}
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedProducts((p) => ({
                                ...p,
                                [item.productId]: !isExpanded,
                              }))
                            }
                            className="text-xs font-semibold text-coral-600 dark:text-amber-400 hover:underline mt-1"
                          >
                            {isExpanded ? "Close" : "+ Rate this specific item"}
                          </button>
                        </div>
                      </div>
                      {pReview.rating > 0 && !isExpanded && (
                        <div className="flex items-center text-amber-400">
                          <Star size={16} className="fill-amber-400" />
                          <span className="text-sm font-bold text-brown-900 dark:text-amber-100 ml-1">
                            {pReview.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="p-5 border-t border-cream-100 dark:border-amber-900/20 bg-cream-50/50 dark:bg-black/10">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-sm font-medium text-brown-600 dark:text-amber-100/70">
                            Rating:
                          </span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  setProductReviews((p) => ({
                                    ...p,
                                    [item.productId]: {
                                      ...pReview,
                                      rating: star,
                                    },
                                  }))
                                }
                              >
                                <Star
                                  size={24}
                                  className={
                                    star <= pReview.rating
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-cream-300 dark:text-amber-900/40"
                                  }
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          value={pReview.text}
                          onChange={(e) =>
                            setProductReviews((p) => ({
                              ...p,
                              [item.productId]: {
                                ...pReview,
                                text: e.target.value,
                              },
                            }))
                          }
                          placeholder="What did you think of this specific piece?"
                          className="w-full h-24 px-4 py-3 bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm resize-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-6">
          {submitError && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium text-center">
              {submitError}
            </div>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full shadow-coral-200 dark:shadow-amber-900/20"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-24">
      <SecondaryHeader
        eyebrow="✦ Share Your Thoughts ✦"
        titlePrefix="Tell us your"
        titleHighlighted="story"
        titleSuffix="."
        description="Every review is read by the hands that poured your candle. Thank you for taking the time to share your experience."
      />
      <Suspense
        fallback={
          <div className="text-center py-20 text-amber-800">Loading...</div>
        }
      >
        <ReviewForm />
      </Suspense>
    </main>
  );
}
