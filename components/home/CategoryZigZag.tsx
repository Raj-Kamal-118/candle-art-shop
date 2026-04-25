"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Category, Product } from "@/lib/types";

interface CategoryZigZagProps {
  categories: Category[];
  productsByCategory: Record<string, Product[]>;
}

const TILTS = [
  "rotate(2deg)",
  "rotate(-2deg)",
  "rotate(1.5deg)",
  "rotate(-1.5deg)",
  "rotate(2.5deg)",
  "rotate(-2.5deg)",
];

const TAPE_ROTATIONS = [
  "translateX(-50%) rotate(-3deg)",
  "translateX(-50%) rotate(2deg)",
  "translateX(-50%) rotate(-2.5deg)",
  "translateX(-50%) rotate(3.5deg)",
  "translateX(-50%) rotate(-1.5deg)",
  "translateX(-50%) rotate(1deg)",
];

export default function CategoryZigZag({
  categories,
  productsByCategory,
}: CategoryZigZagProps) {
  const visible = categories.filter((c) => c.showInHomepage !== false);
  if (visible.length === 0) return null;

  return (
    <section
      className="bg-[var(--home-bg)] dark:bg-[#100e0a] overflow-hidden"
      style={{
        borderTop: "1px solid var(--home-border)",
        padding: "80px 0 40px",
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: ".26em",
              textTransform: "uppercase",
              color: "var(--home-amber)",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            ✦ What we make ✦
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(44px, 7vw, 60px)",
              fontWeight: 900,
              color: "var(--home-text)",
              margin: "0 0 16px",
              lineHeight: 1.0,
            }}
          >
            Everything we{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              <span
                className="dark:candle-text-glow leading"
                style={{
                  fontFamily: "var(--font-script)",
                  fontStyle: "normal",
                  color: "var(--home-coral)",
                  fontWeight: 700,
                  fontSize: "1.08em",
                }}
              >
                love making
              </span>
              <svg
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: -4,
                  width: "100%",
                  height: 12,
                  overflow: "visible",
                }}
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,6 C30,0 60,12 100,6 C140,0 170,12 200,6"
                  fill="none"
                  stroke="var(--home-coral)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 17,
              color: "var(--home-muted)",
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Each made in small batches. When a batch sells out, we make another.
          </p>
        </motion.div>

        {/* Zig-zag rows */}
        <div>
          {visible.map((cat, idx) => {
            const catProducts = productsByCategory[cat.id] || [];
            const imageLeft = idx % 2 === 0;
            const tilt = TILTS[idx % TILTS.length];
            const ghostNum = String(idx + 1).padStart(2, "0");

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.05 }}
                style={{
                  borderBottom:
                    idx < visible.length - 1
                      ? "1px dashed var(--home-border)"
                      : "none",
                  padding: "64px 0",
                }}
              >
                <div
                  className={`flex flex-col gap-10 lg:gap-16 items-center ${imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  {/* Image Stack */}
                  <div className="w-full lg:w-3/5 flex justify-center">
                    <PhotoStack
                      images={(cat.bannerImage || cat.image || "")
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)}
                      alt={cat.name}
                      baseTiltIdx={idx}
                    />
                  </div>

                  {/* Text */}
                  <div
                    className="w-full lg:w-2/5"
                    style={{ position: "relative" }}
                  >
                    {/* Ghost number */}
                    <div
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: imageLeft ? -48 : -32,
                        right: imageLeft ? -64 : -64,
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(100px, 14vw, 160px)",
                        fontWeight: 900,
                        color: "var(--home-ghost)",
                        lineHeight: 1,
                        userSelect: "none",
                        pointerEvents: "none",
                        zIndex: 0,
                      }}
                    >
                      {ghostNum}
                    </div>

                    <div style={{ position: "relative", zIndex: 1 }}>
                      <p
                        style={{
                          fontSize: 11,
                          letterSpacing: ".24em",
                          textTransform: "uppercase",
                          color: "var(--home-amber)",
                          fontWeight: 600,
                          marginBottom: 12,
                        }}
                      >
                        {cat.name}
                      </p>
                      <h3
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: "clamp(32px, 4vw, 48px)",
                          fontWeight: 800,
                          color: "var(--home-text)",
                          lineHeight: 1.1,
                          marginBottom: 16,
                          letterSpacing: "normal",
                        }}
                      >
                        {cat.bannerTitle || cat.name}
                      </h3>
                      {cat.description && (
                        <p
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontStyle: "italic",
                            fontSize: 17,
                            color: "var(--home-muted)",
                            marginBottom: 24,
                            maxWidth: 420,
                          }}
                        >
                          {cat.description}
                        </p>
                      )}

                      <div className="flex flex-col items-start gap-5">
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            background: "var(--home-accent)",
                            color: "var(--home-muted)",
                            borderRadius: 999,
                            padding: "7px 16px",
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {catProducts.length} product
                          {catProducts.length !== 1 ? "s" : ""}
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {(cat.bannerButtons || []).length > 0 ? (
                            cat.bannerButtons!.map((btn, bi) => (
                              <Link
                                key={bi}
                                href={btn.link}
                                className={
                                  btn.variant === "primary"
                                    ? "inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 text-sm"
                                    : "inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-md hover:shadow-lg border border-cream-200 text-sm"
                                }
                              >
                                {btn.text}
                              </Link>
                            ))
                          ) : (
                            <Link
                              href={`/categories/${cat.slug}`}
                              className="inline-flex items-center justify-center gap-2 bg-coral-600 dark:bg-amber-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-coral-700 dark:hover:bg-amber-500 transition-all duration-200 shadow-lg shadow-coral-200 dark:shadow-amber-900/30 hover:-translate-y-0.5 text-sm"
                            >
                              Shop {cat.name} →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PhotoStack({
  images,
  alt,
  baseTiltIdx,
}: {
  images: string[];
  alt: string;
  baseTiltIdx: number;
}) {
  const [topIdx, setTopIdx] = useState(0);
  const stack = Array.from(
    { length: 5 },
    (_, i) => images[i % images.length] || "",
  );

  const baseTiltStr = TILTS[baseTiltIdx % TILTS.length];
  const baseTiltNum = parseFloat(baseTiltStr.replace(/[^\d.-]/g, ""));

  return (
    <div
      className="relative w-full cursor-pointer group"
      style={{ maxWidth: 650, aspectRatio: "3/2" }}
      onClick={() => setTopIdx((prev) => (prev + 1) % stack.length)}
    >
      {stack.map((src, i) => {
        const offset = (i - topIdx + stack.length) % stack.length;
        const isTop = offset === 0;
        const zIndex = stack.length - offset;

        // Randomize placements a bit so the stack looks hand-piled
        const rIdx = (baseTiltIdx + i) % 5;
        const randomRot = [-4, 3, -2, 5, -3][rIdx];
        const randomX = [0, 16, -12, 20, -16][rIdx];
        const randomY = [0, -12, 16, -8, 12][rIdx];

        return (
          <motion.div
            key={i}
            initial={false}
            animate={{
              zIndex,
              scale: isTop ? 1 : 0.95 - offset * 0.02,
              x: isTop ? 0 : randomX + offset * 4,
              y: isTop ? 0 : randomY + offset * 4,
              rotate: isTop ? baseTiltNum : randomRot,
              opacity: offset > 2 ? 0 : 1, // Only render the top 3 cards visually
            }}
            whileHover={{
              scale: isTop ? 1.02 : 0.95 - offset * 0.02,
              rotate: isTop ? baseTiltNum : randomRot + (i % 2 === 0 ? 2 : -2),
              x: isTop ? 0 : randomX + (i % 2 === 0 ? 8 : -8),
            }}
            transition={{ duration: 0.4, ease: "backOut" }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              boxShadow: isTop
                ? "0 24px 60px rgba(28,18,9,.18)"
                : "0 8px 24px rgba(28,18,9,.1)",
              background: "var(--home-accent)",
              transformOrigin: "center",
            }}
          >
            {/* Tape on each individual photo */}
            <div
              style={{
                position: "absolute",
                top: -12,
                left: "50%",
                transform:
                  TAPE_ROTATIONS[(baseTiltIdx + i) % TAPE_ROTATIONS.length],
                background: "rgba(253, 230, 138, 0.5)",
                backdropFilter: "blur(4px)",
                width: 180,
                height: 32,
                zIndex: 10,
                clipPath:
                  "polygon(0% 0%, 100% 0%, 95% 12.5%, 100% 25%, 95% 37.5%, 100% 50%, 95% 62.5%, 100% 75%, 95% 87.5%, 100% 100%, 0% 100%, 5% 87.5%, 0% 75%, 5% 62.5%, 0% 50%, 5% 37.5%, 0% 25%, 5% 12.5%)",
              }}
              aria-hidden="true"
            />
            {src ? (
              <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-cream-50 dark:bg-black/20">
                <Image
                  src={src}
                  alt={`${alt} photo ${i + 1}`}
                  fill
                  sizes="(max-width: 650px) 100vw, 650px"
                  priority={baseTiltIdx === 0 && i === 0}
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 80 }}>🕯️</span>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Hint Badge */}
      <div
        className="absolute bottom-4 right-4 z-50 backdrop-blur-md text-xs font-semibold px-3 py-1.5 rounded-full shadow-md"
        style={{
          pointerEvents: "none",
          background: "var(--home-bg)",
          color: "var(--home-amber)",
          border: "1px solid var(--home-border)",
        }}
      >
        Click to browse
      </div>
    </div>
  );
}
