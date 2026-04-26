"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Product, Category } from "@/lib/types";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialSearchQuery: string;
}

function ClientFiltersAndGrid({
  initialProducts,
  categories,
  initialSearchQuery,
}: ProductsClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchQuery = searchParams.get("search") ?? initialSearchQuery;

  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Get up to 4 featured products to show when search is empty
  const featuredFallback = useMemo(() => {
    const featured = initialProducts.filter((p) => p.featured);
    return featured.length > 0
      ? featured.slice(0, 4)
      : initialProducts.slice(0, 4);
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    if (currentSearchQuery) {
      const lowerQuery = currentSearchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
          (p.tags &&
            p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))),
      );
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [initialProducts, selectedCategory, currentSearchQuery, sortBy]);

  const hasActiveFilters = Boolean(
    selectedCategory || currentSearchQuery || sortBy !== "featured",
  );

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSortBy("featured");
    if (searchParams.toString()) {
      router.push(pathname);
    }
  };

  return (
    <>
      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={filteredProducts.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="py-8 sm:py-12"
        >
          <div className="text-center mb-16">
            <div className="text-5xl mb-4 opacity-80">🕯️</div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brown-900 dark:text-amber-100 mb-3">
              We couldn't find exactly what you were looking for.
            </h2>
            <p
              className="text-brown-500 dark:text-amber-100/70 max-w-lg mx-auto"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 17,
              }}
            >
              While that specific piece isn't in our studio right now, perhaps
              one of our hand-poured favorites might catch your eye?
            </p>
            <div className="mt-8">
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-[#1a1830] dark:border dark:border-amber-700/30 text-forest-800 dark:text-amber-200 px-8 py-3.5 rounded-xl font-semibold hover:bg-cream-100 dark:hover:bg-amber-900/20 transition-all duration-200 shadow-md hover:shadow-lg border border-cream-200 text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          <div className="border-t border-cream-200 dark:border-amber-900/30 pt-12">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-700 dark:text-amber-500">
                ✦ Our Bestsellers
              </h3>
            </div>
            <ProductGrid products={featuredFallback} />
          </div>
        </motion.div>
      )}
    </>
  );
}

export default function ProductsClient(props: ProductsClientProps) {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <ClientFiltersAndGrid {...props} />
    </Suspense>
  );
}
