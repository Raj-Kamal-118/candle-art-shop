"use client";

import { Category } from "@/lib/types";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
}

export default function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalCount,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === ""
              ? "bg-amber-700 text-white shadow-sm"
              : "bg-white text-brown-700 border border-brown-200 hover:border-amber-400"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? "bg-amber-700 text-white shadow-sm"
                : "bg-white text-brown-700 border border-brown-200 hover:border-amber-400"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort + count */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm text-brown-500 hidden sm:block">
          {totalCount} products
        </span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2 bg-white border border-brown-200 rounded-lg text-sm text-brown-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  );
}
