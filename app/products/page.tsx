"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Product, Category } from "@/lib/types";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import SecondaryHeader from "@/components/layout/SecondaryHeader";

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
      <SecondaryHeader
        eyebrow={searchQuery ? "✦ Search Results ✦" : "✦ Our Collection ✦"}
        titlePrefix={searchQuery ? "For" : "All"}
        titleHighlighted={searchQuery ? '"' + searchQuery + '"' : "products"}
        description={
          searchQuery
            ? `Here's what we found for your search.`
            : "Explore our complete range of handcrafted candles, clay art, and creative crafts."
        }
        backgroundImage="/images/misc/checkout.png"
      />

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
