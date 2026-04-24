"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Product, Category } from "@/lib/types";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";

function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.set("categoryId", selectedCategory);
    if (searchQuery) params.set("search", searchQuery);

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => {
        let sorted = [...data];
        if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
        else if (sortBy === "price-desc")
          sorted.sort((a, b) => b.price - a.price);
        else if (sortBy === "newest")
          sorted.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
        else sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        setProducts(sorted);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, sortBy, searchQuery]);

  return (
    <main className="min-h-screen bg-[var(--home-bg-alt)] dark:bg-[#1a1612] pb-20">
      {/* Editorial Header */}
      <section className="relative overflow-hidden text-center p-12 border-b border-cream-200 dark:border-amber-900/20 bg-[var(--home-bg)] dark:bg-[#100e0a]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          {searchQuery ? (
            <>
              <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-500 uppercase tracking-[0.24em] mb-5">
                ✦ Search Results ✦
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-forest-900 dark:text-amber-50 leading-tight mb-6">
                For &ldquo;{searchQuery}&rdquo;
              </h1>
            </>
          ) : (
            <>
              <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-500 uppercase tracking-[0.24em] mb-5">
                ✦ Our Collection ✦
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-forest-900 dark:text-amber-50 leading-tight mb-8">
                All{" "}
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
                    products
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
                  color: "var(--home-muted)",
                  lineHeight: 1.65,
                  maxWidth: 520,
                }}
                className="mx-auto"
              >
                Explore our complete range of handcrafted candles, clay art, and
                creative crafts.
              </p>
            </>
          )}
        </div>
      </section>

      {/* Products Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        <ProductFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={products.length}
        />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-cream-100 dark:bg-amber-900/20" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-cream-100 dark:bg-amber-900/20 rounded w-1/3" />
                  <div className="h-4 bg-cream-200 dark:bg-amber-900/40 rounded w-3/4" />
                  <div className="h-4 bg-cream-100 dark:bg-amber-900/20 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid
            products={products}
            emptyMessage="No products match your criteria."
          />
        )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1440px] mx-auto px-4 py-12 text-center text-brown-500">
          Loading...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
