"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/types";
import PrimarySectionHeader from "@/components/ui/PrimarySectionHeader";
import Tape from "@/components/craft/Tape";
import StickyNote from "@/components/ui/StickyNote";
import HandDrawnStars from "@/components/ui/HandDrawnStars";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  Star,
} from "lucide-react";

function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

const PIN_X_OFFSETS = [-6, 8, 4, -8, 2];
const PIN_Y_OFFSETS = [0, -2, 4, -4, 2];
const PIN_ROTATIONS = [-8, 12, -6, 15, -10];

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  if (products.length === 0) return null;

  const displayProducts = products;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = displayProducts[activeIndex] || displayProducts[0];

  const discount =
    activeProduct.compareAtPrice &&
    activeProduct.compareAtPrice > activeProduct.price
      ? Math.round(
          ((activeProduct.compareAtPrice - activeProduct.price) /
            activeProduct.compareAtPrice) *
            100,
        )
      : null;

  return (
    <section
      className="bg-[var(--home-bg-alt)] dark:bg-[#0a0a16] overflow-hidden relative"
      style={{ borderTop: "1px solid var(--home-border)", padding: "72px 0" }}
    >
      {/* Ambient background glow for warmth */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-coral-300/15 dark:bg-coral-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45rem] h-[45rem] bg-orange-200/10 dark:bg-amber-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <PrimarySectionHeader
            eyebrow="✦ The Atelier ✦"
            titlePrefix="Our most"
            titleHighlighted="loved pieces"
            description="Hand-picked favorites from the studio, crafted with intention and poured with care."
            className="mb-8 lg:mb-10"
          />
        </motion.div>

        {/* Editorial grid / Carousel */}
        <div className="relative group/carousel px-1 sm:px-4 md:px-12 lg:px-16">
          {/* Side Navigation Buttons */}
          <button
            onClick={() =>
              setActiveIndex(
                (prev) =>
                  (prev - 1 + displayProducts.length) % displayProducts.length,
              )
            }
            className="absolute -left-4 sm:left-0 md:left-2 lg:-left-6 top-[30%] lg:top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/40 rounded-full text-brown-500 dark:text-amber-100/60 hover:text-coral-600 dark:hover:text-amber-400 hover:bg-cream-50 dark:hover:bg-[#242040] hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(232,93,74,0.15)] group"
            aria-label="Previous product"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-0.5 transition-transform sm:w-[22px] sm:h-[22px]"
            />
          </button>

          <button
            onClick={() =>
              setActiveIndex((prev) => (prev + 1) % displayProducts.length)
            }
            className="absolute -right-4 sm:right-0 md:right-2 lg:-right-6 top-[30%] lg:top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/40 rounded-full text-brown-500 dark:text-amber-100/60 hover:text-coral-600 dark:hover:text-amber-400 hover:bg-cream-50 dark:hover:bg-[#242040] hover:scale-110 active:scale-95 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(232,93,74,0.15)] group"
            aria-label="Next product"
          >
            <ArrowRight
              size={20}
              className="group-hover:translate-x-0.5 transition-transform sm:w-[22px] sm:h-[22px]"
            />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Just the Polaroid Image */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full flex flex-col items-center justify-center relative"
                >
                  <FeaturedPhotoStack
                    product={activeProduct}
                    activeIndex={activeIndex}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Notebook Details & Mini View */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="min-h-[400px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`desc-${activeProduct.id}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-[#fdfbf7] dark:bg-[#12101e] rounded-2xl p-4 sm:p-10 shadow-xl dark:shadow-2xl border border-cream-200 dark:border-amber-900/30 overflow-hidden notebook-page-container"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, var(--notebook-line) 32px)",
                      backgroundSize: "100% 32px",
                    }}
                  >
                    {/* Notebook styling */}
                    <style>{`.notebook-page-container { --notebook-line: rgba(147, 197, 253, 0.15); --notebook-hole-color: rgba(0,0,0,0.08); } .dark .notebook-page-container { --notebook-line: rgba(147, 197, 253, 0.05); --notebook-hole-color: rgba(255,255,255,0.08); }`}</style>
                    <div className="absolute top-0 left-6 sm:left-10 bottom-0 w-px bg-red-200/70 dark:bg-red-900/40 pointer-events-none" />
                    <div
                      className="absolute top-0 left-2 sm:left-4 bottom-0 w-2 bg-repeat-y pointer-events-none"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at center, transparent 2px, var(--notebook-hole-color) 2px, var(--notebook-hole-color) 3px, transparent 3px)",
                        backgroundSize: "100% 32px",
                        backgroundPosition: "0px 16px",
                      }}
                    />

                    <div className="pl-5 sm:pl-8 relative z-10">
                      <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5">
                        {activeProduct.featured && (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 rounded-md"
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 19,
                            }}
                          >
                            <Sparkles
                              size={14}
                              className="text-amber-500 shrink-0"
                            />{" "}
                            Featured
                          </span>
                        )}
                        {activeProduct.customizable && (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-coral-50 dark:bg-coral-900/20 border border-coral-300 dark:border-coral-700/50 text-coral-700 dark:text-coral-300 rounded-md"
                            style={{
                              fontFamily: "var(--font-hand)",
                              fontSize: 19,
                            }}
                          >
                            <Star
                              size={14}
                              className="text-coral-500 shrink-0"
                            />{" "}
                            Customizable
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-3xl sm:text-4xl font-bold text-brown-900 dark:text-amber-50 mb-3 sm:mb-4 leading-[1.15]">
                        {(() => {
                          const words = activeProduct.name.trim().split(/\s+/);
                          const last = words.pop();
                          return (
                            <>
                              {words.length > 0 && <>{words.join(" ")} </>}
                              <span
                                className="text-coral-600 dark:text-amber-400"
                                style={{
                                  fontFamily: "var(--font-script)",
                                  fontSize: "1.2em",
                                  display: "inline-block",
                                  transform: "rotate(-2deg) translateY(2px)",
                                }}
                              >
                                {last}
                              </span>
                            </>
                          );
                        })()}
                      </h3>

                      <div className="flex items-end justify-between gap-3 mb-5 sm:mb-7 flex-wrap">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span
                            className="font-black text-brown-900 dark:text-amber-100"
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: "clamp(30px,3.2vw,40px)",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {formatPrice(activeProduct.price)}
                          </span>
                          {activeProduct.compareAtPrice && (
                            <span
                              className="text-brown-400 dark:text-amber-100/65 line-through"
                              style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: 17,
                              }}
                            >
                              {formatPrice(activeProduct.compareAtPrice)}
                            </span>
                          )}
                          {discount && (
                            <span
                              className="mb-1.5 ml-1 shadow-sm"
                              style={{
                                display: "inline-block",
                                background: "#e85d4a",
                                color: "white",
                                fontFamily: "var(--font-hand)",
                                fontSize: 18,
                                letterSpacing: "0.08em",
                                fontWeight: 700,
                                padding: "3px 16px 3px 8px",
                                clipPath:
                                  "polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
                                lineHeight: 1.3,
                              }}
                            >
                              {discount}% off
                            </span>
                          )}
                        </div>

                        {/* Reviews */}
                        <div className="hidden md:flex flex-col items-end gap-0.5 pb-0.5 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <HandDrawnStars rating={4.8} size={18} />
                            <span
                              className="font-bold text-brown-700 dark:text-amber-200"
                              style={{
                                fontFamily: "var(--font-hand)",
                                fontSize: 18,
                              }}
                            >
                              4.8
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-brown-400 dark:text-amber-100/70"
                              style={{
                                fontFamily: "var(--font-serif)",
                                fontStyle: "italic",
                                fontSize: 11,
                              }}
                            >
                              24 reviews
                            </span>
                            <Link
                              href="/reviews"
                              className="inline-flex items-center gap-0.5 text-coral-600 dark:text-amber-400 hover:underline"
                              style={{
                                fontFamily: "var(--font-serif)",
                                fontStyle: "italic",
                                fontSize: 11,
                              }}
                            >
                              Read all <ArrowRight size={10} />
                            </Link>
                          </div>
                        </div>
                      </div>

                      {activeProduct.description && (
                        <div
                          className="prose dark:prose-invert font-serif italic text-[14px] sm:text-[16px] text-brown-600 dark:text-amber-100/80 mb-6 sm:mb-8 line-clamp-6 overflow-hidden [&_strong]:text-coral-700 [&_strong]:dark:text-amber-400 [&_strong]:font-bold [&_em]:text-coral-700 [&_em]:dark:text-amber-400"
                          style={{ lineHeight: "32px", marginTop: "-4px" }}
                          dangerouslySetInnerHTML={{
                            __html: activeProduct.description,
                          }}
                        />
                      )}

                      {activeProduct.tags && activeProduct.tags.length > 0 && (
                        <div className="mt-4 sm:mt-6 mb-2">
                          <p
                            className="text-[10px] font-black tracking-[0.18em] uppercase text-brown-400/80 dark:text-amber-100/65 mb-2.5"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            Perfect for
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {activeProduct.tags.slice(0, 6).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1.5 bg-amber-50/80 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300/80 border border-amber-300/70 dark:border-amber-700/40"
                                style={{
                                  fontFamily: "var(--font-hand)",
                                  fontSize: 17,
                                  padding: "3px 12px 3px 10px",
                                  borderRadius: "9999px",
                                }}
                              >
                                <span className="text-amber-500/80">✦</span>{" "}
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Order Button & Mini View */}
              <div className="mt-8 flex flex-col gap-6 pl-2 sm:pl-6">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/products/${activeProduct.slug}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-[0_10px_20px_rgba(215,110,96,0.3)] dark:shadow-[0_10px_20px_rgba(251,191,36,0.15)] hover:-translate-y-0.5 text-sm"
                  >
                    <ShoppingBag size={18} /> Order This product
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mini View Full Width */}
          <div className="mt-4 lg:mt-6 pt-6 border-t border-cream-200 dark:border-amber-900/30 relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brown-400 dark:text-amber-100/50 mb-6 mt-0 text-center relative z-20">
              Also in the atelier
            </p>
            <div className="relative flex justify-start sm:justify-center gap-5 sm:gap-8 overflow-x-auto py-10 px-8 scrollbar-hide snap-x">
              {/* The Clothesline Thread */}
              <svg
                className="absolute pointer-events-none z-0"
                style={{
                  top: 56,
                  left: 0,
                  width: "100%",
                  height: 30,
                  minWidth: "800px",
                }}
                viewBox="0 0 1000 30"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0,5 Q 500,25 1000,5"
                  fill="none"
                  stroke="#6b4423"
                  strokeWidth="2.5"
                />
                <path
                  d="M 0,5 Q 500,25 1000,5"
                  fill="none"
                  stroke="#b5835a"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </svg>

              {displayProducts.map((p, i) => {
                const isActive = i === activeIndex;
                const rotClass = i % 2 === 0 ? "-rotate-3" : "rotate-3";
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveIndex(i)}
                    className={`relative flex flex-col items-center p-1.5 pb-6 sm:p-2 sm:pb-8 bg-white dark:bg-[#1a1830] rounded-sm flex-shrink-0 w-20 sm:w-28 transition-all duration-300 snap-center mt-2 ${
                      isActive
                        ? "shadow-[0_16px_32px_rgba(215,110,96,0.3)] dark:shadow-[0_16px_32px_rgba(251,191,36,0.2)] z-20 scale-[1.15] -translate-y-2 border-2 border-coral-400 dark:border-amber-400 rotate-0"
                        : `shadow-sm dark:shadow-md hover:shadow-md hover:scale-105 hover:-translate-y-1 border border-cream-200 dark:border-amber-900/30 ${rotClass}`
                    }`}
                  >
                    {/* Cloth Clip (Wooden Clothespin) */}
                    <div
                      className="pointer-events-none"
                      style={{
                        position: "absolute",
                        top: -22,
                        left: "calc(50% - 8px)",
                        transform: `translate(${PIN_X_OFFSETS[i % PIN_X_OFFSETS.length]}px, ${PIN_Y_OFFSETS[i % PIN_Y_OFFSETS.length]}px) rotate(${PIN_ROTATIONS[i % PIN_ROTATIONS.length]}deg)`,
                        width: 16,
                        height: 42,
                        zIndex: 10,
                      }}
                    >
                      <motion.div
                        className="w-full h-full origin-top"
                        animate={
                          isActive
                            ? { rotate: [-2.5, 2.5, -2.5], y: [0, -1.5, 0] }
                            : { rotate: 0, y: 0 }
                        }
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 14,
                            left: 4,
                            width: 14,
                            height: 40,
                            backgroundColor: "rgba(0,0,0,0.2)",
                            borderRadius: 4,
                            filter: "blur(2px)",
                            transform: "rotate(-2deg)",
                            zIndex: 1,
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            width: 7,
                            height: 42,
                            backgroundColor: "#d4a373",
                            backgroundImage:
                              "linear-gradient(to bottom, #e2b98e, #c49052)",
                            borderRadius: "3px 3px 2px 4px",
                            border: "1px solid #a6723e",
                            boxShadow:
                              "inset 1px 1px 1px rgba(255,255,255,0.3)",
                            transform: "rotate(-1deg)",
                            transformOrigin: "center 40%",
                            zIndex: 2,
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            width: 7,
                            height: 42,
                            backgroundColor: "#d4a373",
                            backgroundImage:
                              "linear-gradient(to bottom, #e2b98e, #c49052)",
                            borderRadius: "3px 3px 4px 2px",
                            border: "1px solid #a6723e",
                            boxShadow:
                              "inset -1px 1px 1px rgba(255,255,255,0.3)",
                            transform: "rotate(1deg)",
                            transformOrigin: "center 40%",
                            zIndex: 2,
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 12,
                            left: 4,
                            width: 8,
                            height: 8,
                            borderLeft: "2px solid #6b7280",
                            borderTop: "2px solid #6b7280",
                            borderRadius: "4px 0 0 0",
                            zIndex: 3,
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 18,
                            left: -3,
                            width: 22,
                            height: 6,
                            backgroundColor: "#9ca3af",
                            borderRadius: 3,
                            border: "1px solid #4b5563",
                            backgroundImage:
                              "linear-gradient(to bottom, #f3f4f6 0%, #9ca3af 40%, #6b7280 100%)",
                            boxShadow:
                              "0 2px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.8)",
                            zIndex: 3,
                          }}
                        />
                      </motion.div>
                    </div>

                    <div className="relative w-full aspect-square bg-cream-50 dark:bg-[#0a0a16] overflow-hidden rounded-sm mb-1.5 border border-cream-100 dark:border-white/5">
                      {p.images?.[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      ) : (
                        <div className="w-full h-full bg-cream-100 dark:bg-amber-900/20 flex items-center justify-center text-lg">
                          🕯️
                        </div>
                      )}
                    </div>
                    <span
                      className="absolute bottom-1 sm:bottom-1.5 left-0 right-0 text-center px-1 text-sm sm:text-base text-brown-800 dark:text-amber-100 line-clamp-1"
                      style={{ fontFamily: "var(--font-script)" }}
                    >
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {displayProducts.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-8 bg-coral-500 dark:bg-amber-400"
                    : "w-2 bg-cream-300 dark:bg-amber-900/50 hover:bg-brown-300 dark:hover:bg-amber-700"
                }`}
                aria-label={`Go to product ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const CLIP_COLORS = [
  ["#fca5a5", "#dc2626", "#b91c1c", "#7f1d1d"], // Red
  ["#4ade80", "#16a34a", "#15803d", "#14532d"], // Green
  ["#fef08a", "#eab308", "#a16207", "#713f12"], // Yellow
  ["#93c5fd", "#3b82f6", "#1d4ed8", "#1e3a8a"], // Blue
  ["#f3f4f6", "#9ca3af", "#4b5563", "#1f2937"], // White/Silver
];

function FeaturedPhotoStack({
  product,
  activeIndex,
}: {
  product: Product;
  activeIndex: number;
}) {
  const router = useRouter();
  const [topIdx, setTopIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = product.images?.length > 0 ? product.images : [""];

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setTopIdx((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  return (
    <div
      className="relative w-full max-w-[380px] sm:max-w-[460px] aspect-square flex items-center justify-center group cursor-pointer"
      onClick={() => router.push(`/products/${product.slug}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((img, idx) => {
        const offset = (idx - topIdx + images.length) % images.length;
        if (offset > 2) return null; // Show max 3 visually

        const isTop = offset === 0;
        const zIndex = images.length - offset;

        // More organic rotation for a scrapbook feel
        const rotate = offset === 0 ? -1.5 : offset === 1 ? 6 : -10;
        const xOffset = offset === 0 ? 0 : offset === 1 ? 24 : -32;
        const yOffset = offset === 0 ? 0 : offset === 1 ? 12 : -16;

        const clipColors =
          CLIP_COLORS[(activeIndex + idx) % CLIP_COLORS.length];

        return (
          <motion.div
            key={`${img}-${idx}`}
            initial={false}
            animate={{
              x: xOffset,
              y: yOffset,
              rotate: rotate,
              zIndex: zIndex,
              scale: isTop ? 1 : 0.95 - offset * 0.03,
              opacity: offset > 2 ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 70, damping: 14 }}
            whileHover={
              isTop
                ? {
                    scale: 1.03,
                    rotate: rotate - 1,
                    boxShadow: "0 24px 48px -12px rgba(28,18,9,0.3)",
                  }
                : {}
            }
            className="absolute w-full aspect-square rounded-lg bg-white dark:bg-[#1a1830] shadow-[0_16px_40px_rgba(28,18,9,.12)] dark:shadow-amber-900/20 flex flex-col p-3 pb-12 border border-cream-100 dark:border-amber-900/30"
          >
            {/* Realistic Paperclip */}
            <div
              style={{
                position: "absolute",
                top: -20,
                left: offset === 0 ? "15%" : offset === 1 ? "75%" : "6%",
                transform: `rotate(${offset === 0 ? -12 : offset === 1 ? 15 : -20}deg)`,
                zIndex: 10,
              }}
            >
              <svg
                width="32"
                height="64"
                viewBox="0 0 32 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
              >
                <path
                  d="M14 42 V 16 A 6 6 0 0 1 26 16 V 48 A 11 11 0 0 1 4 48 V 16"
                  stroke={`url(#clipMetallic-${idx})`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform="translate(1, 2)"
                  filter={`url(#clipShadow-${idx})`}
                />
                <defs>
                  <filter
                    id={`clipShadow-${idx}`}
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feDropShadow
                      dx="1.5"
                      dy="2.5"
                      stdDeviation="1.5"
                      floodColor="#1c1209"
                      floodOpacity="0.4"
                    />
                  </filter>
                  <linearGradient
                    id={`clipMetallic-${idx}`}
                    x1="4"
                    y1="10"
                    x2="26"
                    y2="59"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor={clipColors[0]} />
                    <stop offset="0.3" stopColor={clipColors[1]} />
                    <stop offset="0.7" stopColor={clipColors[2]} />
                    <stop offset="1" stopColor={clipColors[3]} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Polaroid Photo Wrapper */}
            <div className="relative w-full h-full bg-cream-50 dark:bg-[#0a0a16] overflow-hidden rounded border border-cream-100 dark:border-white/5">
              {img ? (
                img.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
                  <video
                    src={img}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Image
                    src={img}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={activeIndex === 0 && idx === 0}
                    className="object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">
                  🕯️
                </div>
              )}
              {/* Inner shadow/vignette for vintage feel */}
              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none mix-blend-multiply" />
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center px-4">
              <span
                className="text-2xl sm:text-3xl text-brown-800 dark:text-amber-100 line-clamp-1"
                style={{ fontFamily: "var(--font-script)" }}
              >
                {product.name}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
