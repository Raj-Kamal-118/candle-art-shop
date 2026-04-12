"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Star, Check, Image as ImageIcon } from "lucide-react";
import Button from "@/components/ui/Button";

function ReviewForm() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") || "";

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [productName, setProductName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setImage(url);
      } else {
        setImage(URL.createObjectURL(file));
      }
    } catch (error) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          product_name: productName,
          customer_name: customerName,
          location,
          rating,
          text,
          image_url: image,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit review", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} />
        </div>
        <h1 className="font-serif text-4xl font-bold text-brown-900 dark:text-amber-100 mb-4">
          Thank You!
        </h1>
        <p className="text-brown-600 dark:text-amber-100/70 text-lg mb-8">
          Your feedback means the world to us. We appreciate you taking the time
          to share your experience!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="font-serif text-4xl font-bold text-brown-900 dark:text-amber-100 mb-4">
          Share Your Experience
        </h1>
        <p className="text-brown-600 dark:text-amber-100/70">
          We hope you're loving your artisan piece. Let us know how we did!
        </p>
      </div>

      <div className="bg-white dark:bg-[#1a1830] p-8 sm:p-10 rounded-3xl shadow-sm border border-cream-200 dark:border-amber-900/30">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Rating */}
          <div className="text-center">
            <label className="block text-sm font-semibold text-brown-900 dark:text-amber-100 mb-4">
              Overall Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={`${
                      star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300 dark:text-gray-600"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>

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
                placeholder="New York, NY"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brown-900 dark:text-amber-100 mb-2">
              Product Purchased *
            </label>
            <input
              required
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full p-3 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-brown-800 dark:text-amber-100"
              placeholder="e.g. Amber Rose Soy Candle"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brown-900 dark:text-amber-100 mb-2">
              Your Review *
            </label>
            <textarea
              required
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 bg-cream-50 dark:bg-[#0f0e1c] border border-cream-200 dark:border-amber-900/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-brown-800 dark:text-amber-100 resize-none"
              placeholder="What did you love about it?"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brown-900 dark:text-amber-100 mb-3">
              Add a Photo (Optional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                image
                  ? "border-amber-400 bg-amber-50 dark:border-amber-500/50 dark:bg-amber-900/20"
                  : "border-cream-300 bg-cream-50 hover:bg-cream-100 dark:border-amber-900/40 dark:bg-[#0f0e1c]"
              }`}
            >
              {image ? (
                <div className="flex flex-col items-center">
                  <img
                    src={image}
                    alt="Preview"
                    className="h-32 object-cover rounded-xl mb-3 shadow-md"
                  />
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                    Click to replace photo
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon
                    size={32}
                    className="text-brown-400 dark:text-amber-100/40 mb-2"
                  />
                  <p className="text-sm font-medium text-brown-700 dark:text-amber-100/80">
                    Upload a photo of your item
                  </p>
                  <p className="text-xs text-brown-500 dark:text-amber-100/50 mt-1">
                    JPG, PNG
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 text-amber-800">Loading...</div>
      }
    >
      <ReviewForm />
    </Suspense>
  );
}
