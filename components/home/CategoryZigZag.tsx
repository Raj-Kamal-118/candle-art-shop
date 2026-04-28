"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Category, Product, MagazineItem } from "@/lib/types";
import PhotoStack from "./PhotoStack";

interface CategoryZigZagProps {
  categories: Category[];
  productsByCategory: Record<string, Product[]>;
}

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
                  className={`flex flex-col gap-10 items-center ${imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  {/* Image Stack */}
                  <div className="w-full lg:w-3/5 flex justify-center">
                    <PhotoStack
                      items={
                        cat.magazineItems?.length
                          ? cat.magazineItems
                          : (cat.bannerImage || cat.image || "")
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean)
                              .map((url) => ({ url, name: "", link: "" }))
                      }
                      alt={cat.name}
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
                        right: imageLeft ? 0 : -32,
                        fontFamily: "var(--font-serif)",
                        fontSize: "clamp(80px, 14vw, 120px)",
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
