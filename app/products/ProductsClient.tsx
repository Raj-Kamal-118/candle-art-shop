"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  const currentSearchQuery = searchParams.get("search") ?? initialSearchQuery;

  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("featured");

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

  return (
    <>
      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={filteredProducts.length}
      />
      <ProductGrid
        products={filteredProducts}
        emptyMessage="No products match your criteria."
      />
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
