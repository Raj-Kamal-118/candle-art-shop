"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Star,
  Image as ImageIcon,
  ThumbsUp,
  ThumbsDown,
  BadgeCheck,
  ArrowRight,
  Package,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function ReviewCard({ review }: { review: any }) {
  const [expanded, setExpanded] = useState(false);
  const [voted, setVoted] = useState<"yes" | "no" | null>(null);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);

  const photos: string[] =
    Array.isArray(review.images) && review.images.length > 0
      ? review.images
      : Array.isArray(review.photos)
        ? review.photos
        : review.image_url
          ? [review.image_url]
          : [];

  const isLongText = review.text && review.text.length > 200;
  const displayText =
    expanded || !isLongText ? review.text : review.text.slice(0, 200) + "...";

  const helpfulYes = (review.helpful_yes || 0) + (voted === "yes" ? 1 : 0);
  const helpfulNo = (review.helpful_no || 0) + (voted === "no" ? 1 : 0);

  useEffect(() => {
    if (zoomedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomedIndex(null);
      if (e.key === "ArrowLeft")
        setZoomedIndex((prev) => (prev! > 0 ? prev! - 1 : photos.length - 1));
      if (e.key === "ArrowRight")
        setZoomedIndex((prev) => (prev! < photos.length - 1 ? prev! + 1 : 0));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [zoomedIndex, photos.length]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl p-6 sm:p-8 shadow-sm"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 flex items-center justify-center font-bold">
            {review.customer_name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-brown-900 dark:text-amber-100">
                {review.customer_name}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold tracking-wider uppercase text-forest-600 bg-forest-50 px-1.5 py-0.5 rounded-sm dark:bg-forest-900/30 dark:text-forest-400">
                <BadgeCheck size={10} /> Verified
              </span>
            </div>
            <div className="text-xs text-brown-500 dark:text-amber-100/50 mt-0.5">
              {review.location || "Verified Buyer"}
              {review.created_at &&
                ` · ${new Date(review.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}`}
            </div>
          </div>
        </div>
        <div className="flex gap-0.5 shrink-0">
          {[...Array(5)].map((_, j) => (
            <Star
              key={j}
              size={14}
              className={
                j < (review.rating || 5)
                  ? "text-amber-400 fill-amber-400"
                  : "text-cream-300 dark:text-amber-900/40"
              }
            />
          ))}
        </div>
      </div>

      {/* Title & Body */}
      <div className="flex-grow">
        {review.title && (
          <h3 className="font-serif text-lg font-bold text-brown-900 dark:text-amber-100 mb-2">
            {review.title}
          </h3>
        )}
        <p className="text-brown-700 dark:text-amber-100/80 text-[15px] leading-relaxed italic break-words">
          &ldquo;{displayText}&rdquo;
          {isLongText && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="ml-2 text-sm text-coral-600 dark:text-amber-400 font-medium hover:underline"
            >
              Read more
            </button>
          )}
          {isLongText && expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="ml-2 text-sm text-coral-600 dark:text-amber-400 font-medium hover:underline"
            >
              Show less
            </button>
          )}
        </p>
      </div>

      {/* Photos */}
      {photos.length > 0 && (
        <div className="flex gap-2 mt-5 overflow-x-auto pb-2 scrollbar-hide">
          {photos.map((src, i) => (
            <div
              key={i}
              onClick={() => setZoomedIndex(i)}
              className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-cream-200 dark:border-amber-900/30 cursor-pointer"
            >
              <Image
                src={src}
                alt="Review photo"
                fill
                className="object-cover hover:scale-110 transition-transform cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}

      {/* Shop this piece block */}
      {review.product_name && (
        <div className="mt-6 p-4 bg-cream-50 dark:bg-amber-900/10 rounded-xl border border-cream-200 dark:border-amber-900/30 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-[#1a1830] rounded-lg shadow-sm border border-cream-100 dark:border-amber-900/20 flex items-center justify-center text-amber-600 shrink-0">
              <Package size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 mb-0.5">
                Reviewed Item
              </p>
              <p className="text-sm font-semibold text-brown-900 dark:text-amber-100 line-clamp-1">
                {review.product_name}
              </p>
            </div>
          </div>
          <Link
            href={`/products?search=${encodeURIComponent(review.product_name)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1a1830] text-brown-800 dark:text-amber-100 border border-cream-200 dark:border-amber-900/40 rounded-lg text-xs font-semibold hover:border-amber-400 transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            Shop this piece <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Footer - Helpful */}
      <div className="mt-5 pt-5 border-t border-cream-100 dark:border-amber-900/20 flex items-center justify-between gap-4">
        <span className="text-xs font-medium text-brown-500 dark:text-amber-100/50">
          Was this helpful?
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setVoted(voted === "yes" ? null : "yes")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              voted === "yes"
                ? "bg-forest-50 border-forest-200 text-forest-700 dark:bg-forest-900/30 dark:border-forest-800 dark:text-forest-300"
                : "bg-white border-cream-200 text-brown-600 hover:bg-cream-50 dark:bg-[#1a1830] dark:border-amber-900/30 dark:text-amber-100/70"
            }`}
          >
            <ThumbsUp
              size={12}
              className={voted === "yes" ? "fill-current" : ""}
            />{" "}
            {helpfulYes}
          </button>
          <button
            onClick={() => setVoted(voted === "no" ? null : "no")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              voted === "no"
                ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400"
                : "bg-white border-cream-200 text-brown-600 hover:bg-cream-50 dark:bg-[#1a1830] dark:border-amber-900/30 dark:text-amber-100/70"
            }`}
          >
            <ThumbsDown
              size={12}
              className={voted === "no" ? "fill-current" : ""}
            />{" "}
            {helpfulNo}
          </button>
        </div>
      </div>

      {/* Lightbox for zooming photos */}
      <AnimatePresence>
        {zoomedIndex !== null && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setZoomedIndex(null)}
          >
            <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]">
              <X size={32} />
            </button>

            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedIndex((prev) =>
                      prev! > 0 ? prev! - 1 : photos.length - 1,
                    );
                  }}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 p-2 sm:p-3 rounded-full transition-all z-[110]"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedIndex((prev) =>
                      prev! < photos.length - 1 ? prev! + 1 : 0,
                    );
                  }}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 p-2 sm:p-3 rounded-full transition-all z-[110]"
                >
                  <ChevronRight size={32} />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium z-[110] bg-black/40 px-4 py-1.5 rounded-full select-none">
                  {zoomedIndex + 1} / {photos.length}
                </div>
              </>
            )}

            <motion.img
              key={zoomedIndex}
              initial={{ opacity: 0, scale: 0.9, x: 0 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={photos[zoomedIndex]}
              alt="Zoomed review"
              className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl relative z-[105] cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
              drag={photos.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(e, { offset }) => {
                const swipeThreshold = 50;
                if (offset.x < -swipeThreshold) {
                  setZoomedIndex((prev) =>
                    prev! < photos.length - 1 ? prev! + 1 : 0,
                  );
                } else if (offset.x > swipeThreshold) {
                  setZoomedIndex((prev) =>
                    prev! > 0 ? prev! - 1 : photos.length - 1,
                  );
                }
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ReviewsClient({
  initialReviews,
}: {
  initialReviews: any[];
}) {
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(20);

  const filteredReviews = useMemo(() => {
    return initialReviews.filter((r: any) => {
      if (filter === "photos")
        return (
          !!r.image_url ||
          (r.photos && r.photos.length > 0) ||
          (r.images && r.images.length > 0)
        );
      if (filter === "5star") return r.rating === 5;
      return true;
    });
  }, [initialReviews, filter]);

  const visibleReviews = filteredReviews.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20);
  };

  const count = initialReviews.length || 0;
  const average = count
    ? initialReviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) /
      count
    : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: initialReviews.filter((r: any) => r.rating === star).length,
  }));

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
      {/* Summary Card */}
      <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-3xl p-8 mb-12 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <div className="font-serif text-[80px] font-bold text-brown-900 dark:text-amber-100 leading-none">
              {average.toFixed(1)}
            </div>
            <div className="flex gap-1 mt-3 mb-2 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < Math.round(average)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-cream-200 text-cream-200 dark:fill-amber-900/40 dark:text-amber-900/40"
                  }
                />
              ))}
            </div>
            <div className="text-sm font-medium text-brown-500 dark:text-amber-100/60">
              Based on {count} review{count === 1 ? "" : "s"}
            </div>
          </div>
          <div className="md:col-span-2 flex flex-col gap-2.5">
            {distribution.map(({ star, count: c }) => {
              const pct = count ? (c / count) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-4 text-sm">
                  <span className="w-10 font-medium text-brown-700 dark:text-amber-100/70 flex items-center justify-end gap-1.5">
                    {star}{" "}
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  </span>
                  <div className="flex-1 h-2.5 bg-cream-100 dark:bg-amber-900/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-brown-500 dark:text-amber-100/50">
                    {c}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h2 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100">
          Customer Experiences
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              setFilter("all");
              setVisibleCount(20);
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm ${filter === "all" ? "bg-amber-700 text-white dark:bg-amber-600" : "bg-white dark:bg-[#1a1830] text-brown-700 dark:text-amber-100/80 border border-cream-200 dark:border-amber-900/40 hover:border-amber-400"}`}
          >
            All Reviews
          </button>
          <button
            onClick={() => {
              setFilter("photos");
              setVisibleCount(20);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm ${filter === "photos" ? "bg-amber-700 text-white dark:bg-amber-600" : "bg-white dark:bg-[#1a1830] text-brown-700 dark:text-amber-100/80 border border-cream-200 dark:border-amber-900/40 hover:border-amber-400"}`}
          >
            <ImageIcon size={14} /> With Photos
          </button>
          <button
            onClick={() => {
              setFilter("5star");
              setVisibleCount(20);
            }}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm ${filter === "5star" ? "bg-amber-700 text-white dark:bg-amber-600" : "bg-white dark:bg-[#1a1830] text-brown-700 dark:text-amber-100/80 border border-cream-200 dark:border-amber-900/40 hover:border-amber-400"}`}
          >
            <Star
              size={14}
              className={
                filter === "5star"
                  ? "fill-white"
                  : "fill-amber-400 text-amber-400"
              }
            />{" "}
            5 Stars
          </button>
        </div>
      </div>

      {/* Grid */}
      {visibleReviews.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1a1830] rounded-3xl border border-cream-200 dark:border-amber-900/30">
          <Star
            size={40}
            className="mx-auto text-cream-300 dark:text-amber-900/40 mb-4"
          />
          <p className="text-brown-500 dark:text-amber-100/60 font-medium">
            No reviews match this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {visibleReviews.map((review: any) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load More */}
      {visibleCount < filteredReviews.length && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-[#1a1830] text-brown-900 dark:text-amber-100 font-semibold rounded-xl border border-cream-200 dark:border-amber-900/40 hover:border-amber-400 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            Load More Reviews
          </button>
          <p className="mt-4 text-sm text-brown-500 dark:text-amber-100/50 font-medium">
            Showing {visibleReviews.length} of {filteredReviews.length} reviews
          </p>
        </div>
      )}
    </div>
  );
}
