"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/types";

function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

const PIN_COLORS = [
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#eab308", // Yellow
  "#10b981", // Green
  "#a855f7", // Purple
  "#f97316", // Orange
];

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
              fontSize: "clamp(36px, 5vw, 62px)",
              fontWeight: 900,
              color: "var(--home-text)",
              margin: "0 0 16px",
              letterSpacing: "-.03em",
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
                  fontSize: "1.05em",
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
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  border: "1.5px solid var(--home-amber)",
                  color: "var(--home-amber)",
                  borderRadius: 999,
                  padding: "8px 20px",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  letterSpacing: ".02em",
                }}
                className="hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
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
                      <img
                        src={img}
                        alt={p.name}
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

function FeaturedPhotoStack({
  product,
  activeIndex,
}: {
  product: Product;
  activeIndex: number;
}) {
  const [topIdx, setTopIdx] = useState(0);
  const images = product.images?.length > 0 ? product.images : [""];

  return (
    <div
      className="relative w-full max-w-md aspect-[4/3] md:aspect-[3/2] mb-10 flex items-center justify-center group cursor-pointer"
      onClick={() => setTopIdx((prev) => (prev + 1) % images.length)}
    >
      {images.map((img, idx) => {
        const offset = (idx - topIdx + images.length) % images.length;
        if (offset > 2) return null; // Show max 3 visually

        const isTop = offset === 0;
        const zIndex = images.length - offset;

        const pinColor = PIN_COLORS[(activeIndex + idx) % PIN_COLORS.length];
        const rotate = offset === 0 ? -1.5 : offset === 1 ? 4.5 : -5;
        const xOffset = offset === 0 ? 0 : offset === 1 ? 24 : -24;
        const yOffset = offset === 0 ? 0 : offset === 1 ? -8 : 12;

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
            className="absolute w-[80%] aspect-[3/4] md:aspect-square rounded-xl shadow-[0_16px_40px_rgba(28,18,9,.12)] dark:shadow-amber-900/20"
          >
            {/* Thumb Pin (Classic Push Pin) */}
            <div
              style={{
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                width: 24,
                height: 24,
                zIndex: 10,
              }}
            >
              {/* Shadow cast by the pin */}
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  left: 12,
                  width: 12,
                  height: 12,
                  backgroundColor: "rgba(0,0,0,0.25)",
                  borderRadius: "50%",
                  transform: "translate(4px, 4px)",
                  filter: "blur(2px)",
                  zIndex: 1,
                }}
              />

              {/* Pin Base Rim */}
              <div
                style={{
                  position: "absolute",
                  top: 2,
                  left: 2,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: pinColor,
                  backgroundImage:
                    "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.2) 100%)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  zIndex: 2,
                }}
              />

              {/* Pin Handle / Stem */}
              <div
                style={{
                  position: "absolute",
                  top: 5,
                  left: 5,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: pinColor,
                  backgroundImage:
                    "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.4) 100%)",
                  boxShadow:
                    "0 3px 5px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.6)",
                  zIndex: 3,
                }}
              >
                {/* Specular Highlight */}
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: 2,
                    width: 3,
                    height: 3,
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    filter: "blur(0.5px)",
                  }}
                />
              </div>
            </div>

            {/* Polaroid Photo Wrapper */}
            <div className="w-full h-full p-2.5 pb-12 md:pb-14 bg-white dark:bg-[#1a1830] rounded-xl border border-gray-100 dark:border-amber-900/30 flex flex-col">
              {img ? (
                <img
                  src={img}
                  alt={`${product.name} - view ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
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
