"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Category, Product, MagazineItem } from "@/lib/types";
import PhotoStack from "./PhotoStack";
import PrimarySectionHeader from "@/components/ui/PrimarySectionHeader";

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
        >
          <PrimarySectionHeader
            eyebrow="✦ What we make ✦"
            titlePrefix="Everything we"
            titleHighlighted="love making"
            description="Each made in small batches. When a batch sells out, we make another."
            className="mb-10"
          />
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
                      <p className="ah-eyebrow text-[11px] mb-3 text-amber-700 dark:text-amber-500">
                        {cat.name}
                      </p>
                      <h3 className="font-serif text-[clamp(32px,4vw,48px)] font-extrabold text-brown-900 dark:text-amber-50 leading-[1.1] mb-4">
                        {cat.bannerTitle || cat.name}
                      </h3>
                      {cat.description && (
                        <p className="font-serif italic text-[17px] text-brown-500 dark:text-amber-100/60 mb-6 max-w-[420px]">
                          {cat.description}
                        </p>
                      )}

                      <div className="flex flex-col items-start gap-5">
                        <span className="inline-flex items-center bg-cream-100 dark:bg-amber-900/20 text-brown-500 dark:text-amber-100/60 rounded-full px-4 py-[7px] text-[13px] font-medium">
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
