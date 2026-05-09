"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState(currentSearchQuery);

  useEffect(() => {
    setSearchQuery(currentSearchQuery);
  }, [currentSearchQuery]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const maxProductPrice = useMemo(() => {
    return Math.max(...initialProducts.map((p) => p.price), 1000);
  }, [initialProducts]);

  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(maxProductPrice);

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

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
          (p.tags &&
            p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))),
      );
    }

    if (maxPriceFilter < maxProductPrice) {
      result = result.filter((p) => p.price <= maxPriceFilter);
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
  }, [initialProducts, selectedCategory, searchQuery, sortBy, maxPriceFilter]);

  const hasActiveFilters = Boolean(
    selectedCategory ||
    searchQuery ||
    sortBy !== "featured" ||
    maxPriceFilter < maxProductPrice,
  );

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSortBy("featured");
    setSearchQuery("");
    setMaxPriceFilter(maxProductPrice);
    if (searchParams.toString()) {
      router.push(pathname);
    }
  };

  const sidebar = (
    <div className="lg:w-52 xl:w-60 shrink-0">
      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredProducts.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
        maxPrice={maxProductPrice}
        currentMaxPrice={maxPriceFilter}
        onMaxPriceChange={setMaxPriceFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </div>
  );

  const gridContent =
    filteredProducts.length > 0 ? (
      <div className="flex flex-col">
        {/* Control Bar */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-serif italic text-brown-500 dark:text-amber-100/60 px-3 text-sm">
            Showing {filteredProducts.length} curated{" "}
            {filteredProducts.length === 1 ? "piece" : "pieces"}
          </span>
        </div>

        <ProductGrid
          products={filteredProducts}
          viewMode={viewMode}
          columns={3}
        />
      </div>
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
            We couldn&apos;t find exactly what you were looking for.
          </h2>
          <p
            className="text-brown-500 dark:text-amber-100/70 max-w-lg mx-auto"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 17,
            }}
          >
            While that specific piece isn&apos;t in our studio right now,
            perhaps one of our hand-poured favorites might catch your eye?
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
          <ProductGrid products={featuredFallback} columns={3} />
        </div>
      </motion.div>
    );

  return (
    <div className="lg:flex lg:gap-8 lg:items-start">
      {sidebar}
      <div className="flex-1 min-w-0">{gridContent}</div>
    </div>
  );
}

export default function ProductsClient(props: ProductsClientProps) {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <ClientFiltersAndGrid {...props} />
    </Suspense>
  );
}
