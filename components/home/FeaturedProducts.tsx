"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/types";

function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  if (products.length === 0) return null;

  const displayProducts = products.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = displayProducts[activeIndex] || displayProducts[0];

  return (
    <section
      className="bg-[var(--home-bg)] dark:bg-[#100e0a] overflow-hidden"
      style={{ borderTop: "1px solid var(--home-border)", padding: "60px 0" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: ".26em",
              textTransform: "uppercase",
              color: "var(--home-amber)",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            ✦ Our Bestsellers ✦
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 900,
              color: "var(--home-text)",
              margin: "0 0 16px",
              lineHeight: 1,
            }}
          >
            Featured{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="dark:candle-text-glow"
                style={{
                  fontFamily: "var(--font-script)",
                  fontStyle: "normal",
                  color: "var(--home-coral)",
                  fontWeight: 700,
                  fontSize: "1.08em",
                }}
              >
                collection
              </span>
              <svg
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -2,
                  width: "100%",
                  height: 10,
                  overflow: "visible",
                }}
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,5 C40,0 80,10 120,5 C160,0 190,10 200,5"
                  fill="none"
                  stroke="var(--home-coral)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
        </motion.div>

        {/* Editorial grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-center"
        >
          {/* Left 3/5: Active Featured Product */}
          <div className="lg:col-span-3 flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                  filter: "blur(4px)",
                  rotate: -3,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  rotate: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 1.05,
                  filter: "blur(4px)",
                  rotate: 3,
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="w-full flex flex-col items-center text-center"
              >
                <FeaturedPhotoStack
                  product={activeProduct}
                  activeIndex={activeIndex}
                />

                <div className="max-w-md px-4">
                  {activeProduct.tags?.length > 0 && (
                    <p className="font-serif italic text-sm text-brown-500 dark:text-amber-200/60 mb-3">
                      {activeProduct.tags.slice(0, 3).join(" · ")}
                    </p>
                  )}
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-brown-900 dark:text-amber-50 mb-3 leading-tight">
                    {activeProduct.name}
                  </h3>

                  <div className="flex items-center justify-center gap-3 mb-4">
                    {activeProduct.compareAtPrice && (
                      <span className="text-lg font-medium text-brown-400 dark:text-amber-100/40 line-through">
                        {formatPrice(activeProduct.compareAtPrice)}
                      </span>
                    )}
                    <span className="text-xl font-bold text-brown-700 dark:text-amber-300/90">
                      {formatPrice(activeProduct.price)}
                    </span>
                  </div>

                  {activeProduct.description && (
                    <div
                      className="mb-8 mx-auto text-center [&>*]:text-center"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontStyle: "italic",
                        fontSize: 17,
                        color: "var(--home-muted)",
                        maxWidth: 520,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: activeProduct.description,
                      }}
                    />
                  )}

                  <Link
                    href={`/products/${activeProduct.slug}`}
                    className="inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 text-sm"
                  >
                    Make it yours →
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right 2/5: Product List Picker */}
          <div className="lg:col-span-2 flex flex-col gap-3 justify-center">
            <div className="flex justify-end mb-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-md hover:shadow-lg border border-cream-200 text-sm"
              >
                View all products →
              </Link>
            </div>
            {displayProducts.map((p, i) => {
              const isActive = i === activeIndex;
              const img = p.images?.[0] ?? null;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveIndex(i)}
                  className={`group flex items-center gap-5 p-4 rounded-2xl text-left transition-all duration-150 w-full ${
                    isActive
                      ? "bg-white dark:bg-[#1a1830] shadow-xl border border-amber-200 dark:border-amber-700/50 scale-[1.02] z-10"
                      : "bg-transparent hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream-50 dark:bg-black/20 flex-shrink-0 relative shadow-sm">
                    {img ? (
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        sizes="80px"
                        className={`w-full h-full object-cover transition-transform duration-200 ${
                          isActive ? "scale-110" : "group-hover:scale-110"
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🕯️
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-serif text-lg font-bold truncate mb-1 transition-colors ${
                        isActive
                          ? "text-coral-700 dark:text-amber-400"
                          : "text-brown-900 dark:text-amber-100 group-hover:text-coral-600 dark:group-hover:text-amber-300"
                      }`}
                    >
                      {p.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      {p.compareAtPrice && (
                        <span className="text-xs font-medium text-brown-400 dark:text-amber-100/40 line-through">
                          {formatPrice(p.compareAtPrice)}
                        </span>
                      )}
                      <span className="text-sm font-medium text-brown-500 dark:text-amber-100/50">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
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
  const [topIdx, setTopIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const images = product.images?.length > 0 ? product.images : [""];

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setTopIdx((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, isHovered]);

  return (
    <div
      className="relative w-full max-w-2xl aspect-[4/3] md:aspect-[3/2] mb-10 flex items-center justify-center group cursor-pointer"
      onClick={() => setTopIdx((prev) => (prev + 1) % images.length)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((img, idx) => {
        const offset = (idx - topIdx + images.length) % images.length;
        if (offset > 2) return null; // Show max 3 visually

        const isTop = offset === 0;
        const zIndex = images.length - offset;

        const rotate = offset === 0 ? -1.5 : offset === 1 ? 6 : -10;
        const xOffset = offset === 0 ? 0 : offset === 1 ? 32 : -45;
        const yOffset = offset === 0 ? 0 : offset === 1 ? -12 : 24;
        const clipColors = CLIP_COLORS[idx % CLIP_COLORS.length];

        return (
          <motion.div
            key={`${img}-${idx}`}
            initial={false}
            animate={{
              x: xOffset,
              y: yOffset,
              rotate: rotate,
              zIndex: zIndex,
              scale: isTop ? 1 : 0.95 - offset * 0.02,
              opacity: offset > 2 ? 0 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 60,
              damping: 12,
            }}
            whileHover={
              isTop
                ? {
                    scale: 1.03,
                    rotate: rotate - 1.5,
                    boxShadow: "0 30px 60px -15px rgba(28,18,9,0.3)",
                  }
                : {}
            }
            className="absolute w-[90%] max-w-[680px] aspect-[4/3] rounded-xl shadow-[0_16px_40px_rgba(28,18,9,.12)] dark:shadow-amber-900/20"
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
            <div className="w-full h-full p-2.5 pb-10 md:pb-12 bg-white dark:bg-[#1a1830] rounded-xl border border-gray-100 dark:border-amber-900/30 flex flex-col">
              {img ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-cream-50 dark:bg-black/20">
                  <Image
                    src={img}
                    alt={`${product.name} - view ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={activeIndex === 0 && idx === 0}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-cream-50 dark:bg-black/20 rounded-lg">
                  🕯️
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Hint Badge */}
      {images.length > 1 && (
        <div
          className="absolute bottom-0 right-4 z-50 backdrop-blur-md text-xs font-semibold px-3 py-1.5 rounded-full shadow-md"
          style={{
            pointerEvents: "none",
            background: "var(--home-bg)",
            color: "var(--home-amber)",
            border: "1px solid var(--home-border)",
          }}
        >
          Click to browse
        </div>
      )}
    </div>
  );
}
