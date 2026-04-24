"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Category, Product } from "@/lib/types";
import ProductGrid from "@/components/products/ProductGrid";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Gift } from "lucide-react";

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string };
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((cats: Category[]) => {
        const cat = cats.find((c) => c.slug === slug);
        if (cat) {
          setCategory(cat);
          return fetch(`/api/products?categoryId=${cat.id}`).then((r) =>
            r.json(),
          );
        }
        return [];
      })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-32">
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-cream-200 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-cream-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-40 text-center">
        <p className="text-brown-500 text-lg">Category not found.</p>
      </div>
    );
  }

  const displayTitle = category.bannerTitle || category.name || "";
  const titleWords = displayTitle.trim().split(" ");
  const lastWord = titleWords.pop();
  const firstPart = titleWords.length > 0 ? titleWords.join(" ") + " " : "";

  const customCard =
    slug === "scented-candles" || slug === "fridge-magnets" ? (
      <Link
        href={slug === "scented-candles" ? "/custom-candle" : "/custom-magnet"}
        className="group relative bg-white dark:bg-[#1a1830] rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(28,18,9,0.05)] border border-amber-200 dark:border-amber-700/50 hover:shadow-[0_12px_32px_rgba(28,18,9,0.08)] transition-all duration-300 cursor-pointer flex flex-col"
      >
        <div className="relative aspect-square flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-amber-50/50 dark:bg-amber-900/10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-transparent dark:from-amber-500/10 dark:to-transparent" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-white dark:bg-[#0f0e1c] border border-amber-100 dark:border-amber-900/50 rounded-full flex items-center justify-center text-amber-500 shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 dark:text-amber-100 mb-2 leading-tight">
              {slug === "scented-candles"
                ? "Want something truly yours?"
                : "Have a design in mind?"}
            </h3>
            <p className="text-xs sm:text-sm text-brown-600 dark:text-amber-100/70">
              {slug === "scented-candles"
                ? "Design a custom candle. Pick your wax, wick, vessel, and signature scent."
                : "Submit your sketch or photo, and we'll hand-paint a custom magnet."}
            </p>
          </div>
        </div>
        <div className="p-3 sm:p-4 flex flex-col h-auto min-h-[110px] sm:min-h-[130px] justify-center bg-white dark:bg-[#1a1830] border-t border-amber-100 dark:border-amber-900/30">
          <div className="w-full bg-coral-600 group-hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 rounded-lg flex items-center justify-center transition-colors shadow-sm gap-2">
            <Sparkles size={14} />
            {slug === "scented-candles"
              ? "Design Custom Candle"
              : "Create Custom Magnet"}
          </div>
        </div>
      </Link>
    ) : null;

  const giftSetCard = (
    <Link
      href="/gift-sets/build"
      className="group relative bg-white dark:bg-[#1a1830] rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(28,18,9,0.05)] border border-cream-200 dark:border-amber-900/30 hover:shadow-[0_12px_32px_rgba(28,18,9,0.08)] transition-all duration-300 cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-forest-50/50 dark:bg-forest-900/10">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-100/50 to-transparent dark:from-forest-500/10 dark:to-transparent" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 bg-white dark:bg-[#0f0e1c] border border-forest-100 dark:border-forest-900/50 rounded-full flex items-center justify-center text-forest-600 dark:text-forest-400 shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <Gift size={24} />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-brown-900 dark:text-amber-100 mb-2 leading-tight">
            Make it a Gift
          </h3>
          <p className="text-xs sm:text-sm text-brown-600 dark:text-amber-100/70">
            Send items beautifully gift-wrapped to someone special with a
            personalised handwritten note.
          </p>
        </div>
      </div>
      <div className="p-3 sm:p-4 flex flex-col h-auto min-h-[110px] sm:min-h-[130px] justify-center bg-white dark:bg-[#1a1830] border-t border-cream-100 dark:border-amber-900/30">
        <div className="w-full bg-coral-600 group-hover:bg-coral-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold py-2.5 sm:py-3 rounded-lg flex items-center justify-center transition-colors shadow-sm gap-2">
          <Gift size={14} />
          Build a Gift Set
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612]">
      {/* Hero */}
      <section className="relative p-8 border-b border-cream-200 dark:border-amber-900/20 overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        {category.image && (
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 w-full text-left">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl flex flex-col items-start"
          >
            <p className="text-[14px] font-semibold text-amber-400 uppercase tracking-[0.24em] mb-5 drop-shadow-sm">
              ✦ {category.name} Collection ✦
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 drop-shadow-md">
              {firstPart}
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
                  {lastWord}
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
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 18,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.65,
                maxWidth: 520,
              }}
              className="drop-shadow-sm"
            >
              {category.bannerDescription || category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-20 lg:py-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 18,
                color: "var(--home-muted)",
              }}
            >
              {products.length} crafted piece{products.length !== 1 ? "s" : ""}
            </p>
          </div>

          <ProductGrid
            products={products}
            emptyMessage={`No products in ${category.name} yet.`}
            customCard={customCard}
            customCardEnd={giftSetCard}
          />
        </div>
      </section>
    </div>
  );
}
