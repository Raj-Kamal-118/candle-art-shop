"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Category, Product } from "@/lib/types";
import ProductCarousel from "@/components/products/ProductCarousel";

interface CategoryBannerSectionProps {
  category: Category;
  products: Product[];
}

export default function CategoryBannerSection({
  category,
  products,
}: CategoryBannerSectionProps) {
  if (!category.showInHomepage) return null;

  const hasBanner =
    category.bannerTitle || category.bannerDescription || category.bannerImage;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative py-12"
    >
      {/* Per-category subtle candle glow */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center z-0 overflow-hidden">
        <div className="w-[800px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] opacity-0 dark:opacity-100 transition-opacity duration-700" />
      </div>

      {/* ── Banner ─────────────────────────────────────────────────────────── */}
      {hasBanner && (
        <div
          className="relative z-10 rounded-3xl overflow-hidden mb-8 min-h-[220px] flex items-center shadow-sm dark:shadow-none dark:border dark:border-amber-900/20"
          style={{
            backgroundColor: category.bannerBgColor || "#f5f0eb",
          }}
        >
          {/* Background image */}
          {category.bannerImage && (
            <Image
              src={category.bannerImage}
              alt={category.bannerTitle || category.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Overlay */}
          {category.bannerImage && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          )}

          {/* Content */}
          <div className="relative z-10 px-8 sm:px-14 py-10 max-w-2xl">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{
                color: category.bannerImage
                  ? "rgba(255,255,255,0.7)"
                  : "#9a7b5a",
              }}
            >
              {category.name}
            </p>
            <h2
              className="font-serif text-3xl sm:text-4xl font-bold mb-3 leading-tight"
              style={{ color: category.bannerImage ? "#ffffff" : "#2d1f14" }}
            >
              {category.bannerTitle || category.name}
            </h2>
            {category.bannerDescription && (
              <p
                className="text-base leading-relaxed mb-6 max-w-md"
                style={{
                  color: category.bannerImage
                    ? "rgba(255,255,255,0.8)"
                    : "#6b5040",
                }}
              >
                {category.bannerDescription}
              </p>
            )}

            {/* Banner buttons */}
            <div className="flex flex-wrap gap-3">
              {(category.bannerButtons || []).length > 0 ? (
                category.bannerButtons!.map((btn, i) => (
                  <Link
                    key={i}
                    href={btn.link}
                    className={
                      btn.variant === "primary"
                        ? "inline-flex items-center gap-2 bg-coral-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-coral-700 transition-colors shadow-md"
                        : "inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/40 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/30 transition-colors"
                    }
                  >
                    {btn.text}
                    <ArrowRight size={14} />
                  </Link>
                ))
              ) : (
                <Link
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center gap-2 bg-coral-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-coral-700 transition-colors shadow-md"
                >
                  Shop {category.name}
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Product Carousel ──────────────────────────────────────────────── */}
      {products.length > 0 && (
        <div className="relative z-10">
          {!hasBanner && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100">
                {category.name}
              </h2>
              <Link
                href={`/categories/${category.slug}`}
                className="text-sm text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {hasBanner && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-brown-600 dark:text-amber-300">
                {products.length} product{products.length !== 1 ? "s" : ""} in
                this category
              </p>
              <Link
                href={`/categories/${category.slug}`}
                className="text-sm text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-medium"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
          )}

          <ProductCarousel products={products} />
        </div>
      )}
    </motion.section>
  );
}
